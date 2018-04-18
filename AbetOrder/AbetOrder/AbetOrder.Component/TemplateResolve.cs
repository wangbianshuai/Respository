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

        public string ResolveContent(string templateContent, IEntityData data)
        {
            if (string.IsNullOrEmpty(templateContent)) return string.Empty;

            //解析步骤

            //获取内容标签信息列表
            List<IEntityData> contentTagList = GetContentTagList();
            List<OpenDataAccess.Utility.TagInfo> tagInfoList = new List<OpenDataAccess.Utility.TagInfo>();

            //替换内容标签内容
            contentTagList.ForEach(c =>
            {
                string ps = c.GetStringValue("PropertyNames");
                c.SetValue("PropertyNameList", string.IsNullOrEmpty(ps) ? new List<string>() : ps.Split(new char[] { ',', '，' }).ToList());
            });

            List<string> nameList = contentTagList.Select(s => s.GetStringValue("Name")).ToList();

            templateContent = OpenDataAccess.Utility.TagParse.GetTagInfoList(templateContent, nameList, tagInfoList);

            ////解析内容标签
            ResolveContentTagList(contentTagList, tagInfoList, data);

            //替换内容标签内容
            tagInfoList.ForEach(t =>
            {
                templateContent = templateContent.Replace(t.ReplaceId.ToString(), t.ResolveContent);
            });

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

                parameterNames.ForEach(n => parameterList.Add(this.CurrentDataBase.InParameter("@" + n, GetTagAttrValue(n, tagInfo.TagAttributes, tagData, data))));

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

            foreach (var kvp in data)
            {
                content = content.Replace(string.Concat("${", tagInfo.TagName, ".", kvp.Key, "}"), kvp.Value == null ? string.Empty : kvp.Value.ToString());
            }

            tagInfo.PropertyNameList.ForEach(p =>
            {
                content = content.Replace(string.Concat("${", tagInfo.TagName, ".", p, "}"), string.Empty);
            });

            tagInfo.ChildTags.ForEach(t =>
            {
                ResolveContentTag(contentTagList, t, tagData, entityData);
            });

            //替换内容标签内容
            tagInfo.ChildTags.ForEach(t =>
            {
                content = content.Replace(t.ReplaceId.ToString(), t.ResolveContent);
            });

            return content;
        }

        List<Dictionary<string, object>> RequestWebApi(string url, Dictionary<string, object> request)
        {
            url = OpenDataAccess.Utility.Common.AddUrlRandom(url);
            var response = new HttpClient().PostAsync(url, new StringContent(OpenDataAccess.Utility.Common.ToJson(request), Encoding.UTF8, "application/json"));

            string result = response.Result.Content.ReadAsStringAsync().Result;

            return OpenDataAccess.Utility.Common.ParseJsonContent(result);
        }

        object GetTagAttrValue(string name, Dictionary<string, object> dict, Dictionary<string, Dictionary<string,object>> tagData, IEntityData data)
        {
            if (dict == null) return null;

            name = "@" + name;

            if (dict.ContainsKey(name))
            {
                object value = dict[name];
                if (value is string)
                {
                    string str = value.ToString();
                    if (str.StartsWith("${") && str.EndsWith("}"))
                    {
                        str = str.Substring(2, str.Length - 3);
                        string[] names = str.Split('.');
                        if (names.Length == 1) return data.GetValue(str);
                        else if (names.Length == 2 && tagData.ContainsKey(names[0])) return tagData[names[0]].GetValue(names[1]);
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
            return this.SelectEntities(query);
        }
    }
}
