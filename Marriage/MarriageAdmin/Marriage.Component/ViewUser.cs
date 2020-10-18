using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace Marriage.Component
{
    public class ViewUser : EntityRequest
    {
        EntityType _ViewUserUserTagEntity { get; set; }
        EntityType _ViewUser2Entity { get; set; }
        EntityType _ViewUserUserTag2Entity { get; set; }
        public ViewUser()
        {
        }

        public ViewUser(Request request)
            : base(request)
        {
            _ViewUserUserTagEntity = EntityType.GetEntityType<Entity.ViewUserUserTag>();
            _ViewUser2Entity = EntityType.GetEntityType<Entity.ViewUser2>();
            _ViewUserUserTag2Entity = EntityType.GetEntityType<Entity.ViewUserUserTag2>();

            ExpandSelectQuery = (query) => ExpandExcelExport(query);
        }

        public object Select2()
        {
            var whereField = this._QueryRequest.QueryInfo.WhereFields.Where(w => w.Name == "UserTagId" && !string.IsNullOrEmpty(w.Value)).FirstOrDefault();
            if (whereField != null)
            {
                this._Request.Entity = _ViewUserUserTagEntity;
                this.EntityType = _ViewUserUserTagEntity;
            }
            object obj = this.Select();
            if (obj is List<IEntityData>)
            {
                List<IEntityData> entityDataList = obj as List<IEntityData>;
                List<IEntityData> userTagList = this.GetUserTagList(entityDataList.Select(s => s.GetValue<string>("OpenId")).ToList());

                var groupby = userTagList.GroupBy(g => g.GetValue<string>("OpenId"));

                var list = (from a in entityDataList
                            from b in groupby
                            where a.GetValue<string>("OpenId") == b.Key
                            select new { a, b });

                foreach (var c in list)
                {
                    var userUserTags = new List<Dictionary<string, object>>();
                    Dictionary<string, object> userUsertTag = null;
                    string userTagNames = string.Empty;
                    string name = string.Empty;

                    foreach (var d in c.b)
                    {
                        userUsertTag = new Dictionary<string, object>();
                        name = d.GetStringValue("Name");

                        userUsertTag.Add("UserTagId", d.GetValue("UserTagId"));
                        userUsertTag.Add("Name", name);
                        userUserTags.Add(userUsertTag);

                        userTagNames += name + ",";
                    }
                    userTagNames = userTagNames.TrimEnd(',');

                    c.a.SetValue("UserUserTags", userUserTags);
                    c.a.SetValue("UserTagNames", userTagNames);
                }

                Dictionary<string, object> dict = new Dictionary<string, object>();
                dict.Add("ViewUser", obj);
                return dict;
            }
            return obj;
        }

        List<IEntityData> GetUserTagList(List<string> openIdList)
        {
            if (openIdList == null || openIdList.Count == 0) return new List<IEntityData>();

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();

            List<string> inParameterList = new List<string>();
            openIdList.ToList().ForEach(id =>
            {
                var parameterName = "@P" + Guid.NewGuid().ToString().Substring(0, 8).ToString();
                parameterList.Add(this.InParameter(parameterName, id));
                inParameterList.Add(parameterName);
            });

            IQuery query = new Query("t_User_UserTag a");
            query.Join("inner join t_UserTag b on a.UserTagId=b.UserTagId and b.IsDelete=0");
            query.Select("a.OpenId,a.UserTagId,b.Name");

            query.Where(string.Format("where a.OpenId in ({0})", string.Join(",", inParameterList)), parameterList);

            return this.SelectEntities(query);
        }

        public object ExcelExport()
        {
            return this.Select();
        }

        IQuery ExpandExcelExport(IQuery query)
        {
            var whereField = this._QueryRequest.QueryInfo.WhereFields.Where(w => w.Name == "UserTagId" && !string.IsNullOrEmpty(w.Value)).FirstOrDefault();
            if (whereField != null)
            {
                query.TableName = _ViewUserUserTag2Entity.TableName;
                query.EntityName = _ViewUserUserTag2Entity.Name;
            }
            else
            {
                query.TableName = _ViewUser2Entity.TableName;
                query.EntityName = _ViewUser2Entity.Name;
            }
            return query;
        }
    }
}
