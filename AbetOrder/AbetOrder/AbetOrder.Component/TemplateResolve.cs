using OpenDataAccess.Data;
using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using OpenDataAccess.Utility;

namespace AbetOrder.Component
{
    public class TemplateResolve : EntityRequest
    {
        EntityType _ContentTagEntity { get; set; }

        public TemplateResolve()
        {
            _ContentTagEntity = EntityType.GetEntityType<Entity.ContentTag>();
        }

        public TemplateResolve(Request request)
            : base(request)
        {
        }

        public string ResolveContent(string templateContent, string entityName, IEntityData data)
        {
            if (string.IsNullOrEmpty(templateContent)) return string.Empty;

            //解析步骤
            Dictionary<string, string> valueDict = new Dictionary<string, string>();
            string replaceId = string.Empty;

            foreach (var kvp in data.ToDictionary())
            {
                replaceId = Guid.NewGuid().ToString();
                valueDict.Add(replaceId, kvp.Value == null ? string.Empty : kvp.Value.ToString());
                templateContent = templateContent.Replace(string.Concat("${", entityName.ToLower(), kvp.Key, "}"), replaceId);
            }

            //获取内容标签信息列表
            List<IEntityData> contentTagList = GetContentTagList();
            List<OpenDataAccess.Utility.TagInfo> tagInfoList = new List<OpenDataAccess.Utility.TagInfo>();

            List<string> nameList = contentTagList.Select(s => s.GetStringValue("Name")).ToList();

            templateContent = OpenDataAccess.Utility.TagParse.GetTagInfoList(templateContent, nameList, tagInfoList);

            ////解析内容标签
            ResolveContentTagList(contentTagList, tagInfoList, data);

            //替换内容标签内容
            tagInfoList.ForEach(t =>
            {
                templateContent = templateContent.Replace(t.ReplaceId.ToString(), t.ResolveContent);
            });

            foreach (var kvp in valueDict)
            {
                templateContent = templateContent.Replace(kvp.Key, kvp.Value);
            }

            return templateContent;
        }

        void ResolveContentTagList(List<IEntityData> contentTagList, List<OpenDataAccess.Utility.TagInfo> tagInfoList, IEntityData data)
        {
            Dictionary<string, Dictionary<string,object>> tagData = new Dictionary<string, Dictionary<string,object>>();
            tagInfoList.ForEach(t => ResolveContentTag(contentTagList, t, tagData, data));
        }

        void ResolveContentTag(List<IEntityData> contentTagList, OpenDataAccess.Utility.TagInfo tagInfo,  Dictionary<string, Dictionary<string,object>> tagData, IEntityData data)
        {
            IEntityData entityData = contentTagList.Where(w => w.GetStringValue("Name") == tagInfo.TagName).FirstOrDefault();

            string pns = entityData.GetStringValue("ParameterNames");
            List<string> parameterNames = string.IsNullOrEmpty(pns) ? new List<string>() : pns.Split(new char[] { ',', '，' }).ToList();

            List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();

            string sql = entityData.GetStringValue("SqlStatement");
            if (!string.IsNullOrEmpty(sql))
            {
                List<System.Data.IDbDataParameter> parameterList = new List<System.Data.IDbDataParameter>();

                parameterNames.ForEach(n => parameterList.Add(this.CurrentDataBase.InParameter(GetParameterName(n), GetTagAttrValue(n, tagInfo.TagAttributes, tagData, data))));

                IDataReader reader = this.CurrentDataBase.ExecSqlReader(sql, parameterList);
                dataList = this.CurrentDataBase.DataReaderToDictionaryList(reader);
            }
            else
            {
                string webApiUrl = entityData.GetStringValue("WebApiUrl");
                if (!string.IsNullOrEmpty(webApiUrl))
                {
                    Dictionary<string, object> request = new Dictionary<string, object>();
                    object value = null;
                    parameterNames.ForEach(n =>
                    {
                        value = GetTagAttrValue(n, tagInfo.TagAttributes, tagData, data);
                        if (value != null) request.Add(n, value);
                    });

                    dataList = RequestWebApi(webApiUrl, request);
                }
            }

            tagInfo.PropertyNameList = entityData.GetValue<List<string>>("PropertyNameList");

            List<string> contentList = new List<string>();

            dataList.ForEach(d =>
            {
                contentList.Add(ResolveContentTagData(contentTagList, d, tagInfo, tagData, data));
            });

            tagInfo.ResolveContent = string.Join(string.Empty, contentList);
        }

        string ResolveContentTagData(List<IEntityData> contentTagList, Dictionary<string, object> data, OpenDataAccess.Utility.TagInfo tagInfo, Dictionary<string, Dictionary<string, object>> tagData, IEntityData entityData)
        {
            string content = tagInfo.TagContent;

            tagData[tagInfo.TagName] = data;

            Dictionary<string, string> valueDict = new Dictionary<string, string>();
            string replaceId = string.Empty;

            foreach (var kvp in data)
            {
                replaceId = Guid.NewGuid().ToString();
                valueDict.Add(replaceId, kvp.Value == null ? string.Empty : kvp.Value.ToString());
                content = content.Replace(string.Concat("${", tagInfo.TagName, ".", kvp.Key, "}"), replaceId);
            }

            tagInfo.ChildTags.ForEach(t =>
            {
                ResolveContentTag(contentTagList, t, tagData, entityData);
            });

            //替换内容标签内容
            tagInfo.ChildTags.ForEach(t =>
            {
                content = content.Replace(t.ReplaceId.ToString(), t.ResolveContent);
            });

            foreach (var kvp in valueDict)
            {
                content = content.Replace(kvp.Key, kvp.Value);
            }

            return content;
        }

        List<Dictionary<string, object>> RequestWebApi(string url, Dictionary<string, object> request)
        {
            url = OpenDataAccess.Utility.Common.AddUrlRandom(url);
            var response = new HttpClient().PostAsync(url, new StringContent(OpenDataAccess.Utility.Common.ToJson(request), Encoding.UTF8, "application/json"));

            string result = response.Result.Content.ReadAsStringAsync().Result;

            return OpenDataAccess.Utility.Common.ParseJsonContent(result);
        }

        string GetParameterName(string name)
        {
            return "@" + name.Split('|')[0];
        }

        object GetTagAttrValue(string name, Dictionary<string, object> dict, Dictionary<string, Dictionary<string, object>> tagData, IEntityData data)
        {
            if (dict == null) return null;

            string[] ns = name.Split('|');
            name = "@" + ns[0];

            string dataType = ns.Length == 2 ? ns[1] : "string";

            if (dict.ContainsKey(name))
            {
                object value = dict[name];
                if (value != null)
                {
                    string str = value.ToString();
                    if (str.StartsWith("${") && str.EndsWith("}"))
                    {
                        str = str.Substring(2, str.Length - 3);
                        string[] names = str.Split('.');
                        if (names.Length == 1) return OpenDataAccess.Utility.Common.ChangeType(data.GetValue(str), dataType);
                        else if (names.Length == 2 && tagData.ContainsKey(names[0])) return OpenDataAccess.Utility.Common.ChangeType(tagData[names[0]].GetValue(names[1]), dataType);
                        else return null;
                    }
                }

                return value;
            }

            return null;
        }

        List<IEntityData> GetContentTagList()
        {
            IQuery query = new Query(_ContentTagEntity.TableName);
            query.Where("where IsDelete=0");
            return this.SelectEntities(query);
        }
    }
}
