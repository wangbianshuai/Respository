using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System.Data;
using System.Threading.Tasks;
using System.Web;

namespace OpenDataAccessCore.Service
{
    public class EntityRequest : EntityAccess, IEntityAccess, IEntityRequest
    {
        public QueryRequest _QueryRequest { get; set; }
        public Request _Request { get; set; }
        public Func<IQuery, IQuery> ExpandSelectQuery { get; set; }

        public EntityRequest()
        {
        }

        public EntityRequest(Request request)
        {
            _Request = request;
            _QueryRequest = new QueryRequest(_Request, this);
            this.EntityType = _Request.Entity;
        }

        public Dictionary<string, object> GetExceptionDict(string message)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("Exception", message);
            return dict;
        }

        public Dictionary<string, object> GetMessageDict(string message)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("Message", message);
            return dict;
        }

        public Dictionary<string, object> GetBoolDict(bool blSucceed)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            if (blSucceed)
            {
                dict.Add("Succeed", "操作成功！");
            }
            else
            {
                dict.Add("Message", "操作失败！");
            }
            return dict;
        }


        /// <summary>
        /// 比较版本
        /// </summary>
        /// <param name="newEntityData"></param>
        /// <param name="oldEntityData"></param>
        /// <returns></returns>
        public string CompareVersion(IEntityData newEntityData, IEntityData oldEntityData)
        {
            string newRowVersion = newEntityData.GetStringValue("RowVersion");
            string oldRowVersion = oldEntityData.GetStringValue("RowVersion");

            if (!string.IsNullOrEmpty(newRowVersion) && !string.IsNullOrEmpty(oldRowVersion) && !newRowVersion.ToLower().Equals(oldRowVersion.ToLower()))
            {
                return "对不起，更新数据不是最新版本，请刷新后再操作！";
            }

            return string.Empty;
        }

        public bool JudgeIsEdit(EntityType entityType, IEntityData newEntityData, IEntityData oldEntityData)
        {
            var data = (from a in newEntityData.ToDictionary()
                        from b in oldEntityData.ToDictionary()
                        from c in entityType.Properties
                        where a.Key.Trim().ToLower() == b.Key.Trim().ToLower() && a.Key.Trim().ToLower() == c.Name.Trim().ToLower()
                        select new { a, b });
            bool blEdit = false;
            foreach (var d in data)
            {
                if ((d.a.Value == null && d.b.Value != null) || (d.a.Value != null && d.b.Value == null))
                {
                    blEdit = true;
                }
                else if (d.b.Value != null && !d.b.Value.Equals(Common.ChangeType(d.a.Value, d.b.Value.GetType())))
                {
                    blEdit = true;
                }
                if (blEdit)
                {
                    break;
                }
            }
            return blEdit;
        }

        public Action<IEntityData, string, List<IDbDataParameter>> QueryGroupByInfo { get; set; }

        public string AddWithNoLock()
        {
            if (this.CurrentDataBase.ClientType == ServerClient.MySqlClient) return string.Empty;
            return " with(nolock)";
        }

        public object Select()
        {
            IQuery query = null;
            if (this._QueryRequest.IsQuery)
            {
                if (this._QueryRequest.QueryInfo != null)
                {
                    if (string.IsNullOrEmpty(this._QueryRequest.QueryInfo.ProcName))
                    {
                        query = this._QueryRequest.QueryInfo.ToQuery(this._Request.Entity);
                    }
                }
                else
                {
                    Dictionary<string, object> dict = new Dictionary<string, object>();
                    dict.Add("NoQueryInfo", true);
                    return dict;
                }
            }
            else
            {
                query = _QueryRequest.ToQuery();
            }
            string action = this._QueryRequest.GetParameterValue("Action");
            string title = this._QueryRequest.GetParameterValue("Title");
            string entityName = this._QueryRequest.GetParameterValue("EntityName");
            if (_QueryRequest.IsPage)
            {
                IEntityData pageInfo = new EntityData("PageInfo");

                if (_QueryRequest.IsGroupByInfo && QueryGroupByInfo != null)
                {
                    IEntityData data = new EntityData(this.EntityType);

                    Parallel.Invoke(() =>
                    {
                        QueryGroupByInfo(data, this._QueryRequest.GroupByInfoWhereSql, this._QueryRequest.GroupByInfoParameterList);
                    },
                   () =>
                   {
                       QueryPage(query, pageInfo);
                       data.SetValue("PageInfo", pageInfo);
                   });

                    return data;
                }
                else
                {
                    QueryPage(query, pageInfo);
                    return pageInfo;
                }
            }
            else if (_QueryRequest.IsData && action != "Excel")
            {
                if (string.IsNullOrEmpty(this._QueryRequest.QueryInfo.ProcName))
                {
                    string pageSizeString = _QueryRequest.GetParameterValue("PageSize");
                    string pageIndexString = _QueryRequest.GetParameterValue("PageIndex");
                    int pageSize = string.IsNullOrEmpty(pageSizeString) ? 20 : int.Parse(pageSizeString);
                    int pageIndex = string.IsNullOrEmpty(pageIndexString) ? 1 : int.Parse(pageIndexString);
                    StringBuilder sb = new StringBuilder();
                    sb.Append("select * from (");
                    if (this.CurrentDataBase.ClientType == ServerClient.MySqlClient)
                    {
                        sb.AppendFormat("select ");
                        sb.Append(string.IsNullOrEmpty(query.ToSelectSql().Trim()) ? "t.*" : query.ToSelectSql());
                        sb.AppendFormat(" from {0} {1} {2} {3}) a",
                            _Request.Entity.TableName + " t",
                            query.ToWhereSql(),
                            query.ToGroupSql(),
                            string.IsNullOrEmpty(query.ToOrderBySql().Trim()) ? "order by " + _Request.Entity.PrimaryKey : query.ToOrderBySql());
                        sb.AppendFormat(" limit {0},{1}", (pageIndex - 1) * pageSize, pageIndex * pageSize);
                    }
                    else
                    {
                        sb.AppendFormat("select row_number() over({0}) as rn,", string.IsNullOrEmpty(query.ToOrderBySql().Trim()) ? "order by " + _Request.Entity.PrimaryKey : query.ToOrderBySql());
                        sb.Append(string.IsNullOrEmpty(query.ToSelectSql().Trim()) ? "t.*" : query.ToSelectSql());
                        sb.AppendFormat(" from {0} {1} {2}) a", _Request.Entity.TableName + " t" + this.AddWithNoLock(), query.ToWhereSql(), query.ToGroupSql());
                        sb.AppendFormat(" where a.rn > {0} and a.rn <= {1}", (pageIndex - 1) * pageSize, pageIndex * pageSize);
                    }

                    query.SetSql(sb.ToString());

                    if (_QueryRequest.IsWidth)
                    {
                        Dictionary<string, object> dict = new Dictionary<string, object>();
                        List<IEntityData> entityDataList = this.SelectEntities(query);
                        dict.Add(_Request.Entity.Name, entityDataList);
                        bool hasLabel = false;
                        if (this._QueryRequest.QueryInfo != null)
                        {
                            hasLabel = this._QueryRequest.QueryInfo.HasLabel;
                        }
                        dict.Add("ColumnWidth", Utility.Common.GetColumnWidth(Parse.IEntityToDictionaryList(entityDataList), hasLabel));
                        return dict;
                    }
                    else
                    {
                        return this.SelectEntities(query);
                    }
                }
                else
                {
                    List<IEntityData> entityDataList = this.SelectEntities(this.EntityType.Name, this._QueryRequest.QueryInfo.ProcName, this._QueryRequest.QueryInfo.ParameterList);
                    if (!string.IsNullOrEmpty(this._QueryRequest.QueryInfo.FieldSql))
                    {
                        List<string> fieldList = this._QueryRequest.QueryInfo.FieldSql.TrimEnd(',').Split(',').ToList();

                        List<IEntityData> dataList = new List<IEntityData>();
                        IEntityData data = null;

                        entityDataList.ForEach(e =>
                        {
                            data = new EntityData(this.EntityType.Name);
                            (from a in e.ToDictionary()
                             from b in fieldList
                             where a.Key.Trim().ToLower() == b.Trim().ToLower()
                             select a).ToList().ForEach(kvp =>
                             {
                                 data.SetValue(kvp.Key, kvp.Value);
                             });
                            dataList.Add(data);
                        });

                        return dataList;
                    }
                    return entityDataList;
                }
            }
            else if (_QueryRequest.PrimaryKeyProperty != null)
            {
                return this.SelectEntity(query);
            }
            else if (action == "Excel")
            {
                if (string.IsNullOrEmpty(this._QueryRequest.QueryInfo.ProcName))
                {
                    string groupSql = query.ToGroupSql();

                    if (!string.IsNullOrEmpty(groupSql.Trim()))
                    {
                        StringBuilder sb = new StringBuilder();
                        sb.Append("select ");
                        sb.Append(string.IsNullOrEmpty(query.ToSelectSql().Trim()) ? "t.*" : query.ToSelectSql());
                        sb.AppendFormat(" from {0} {1} {2} {3}", _Request.Entity.TableName + " t"+ this.AddWithNoLock(), query.ToWhereSql(), groupSql, string.IsNullOrEmpty(query.ToOrderBySql().Trim()) ? "order by " + _Request.Entity.PrimaryKey : query.ToOrderBySql());
                        query.SetSql(sb.ToString());
                    }
                    else if (this._QueryRequest.QueryInfo != null && this._QueryRequest.QueryInfo.HeaderInfos != null)
                    {
                        query.Select(this._QueryRequest.QueryInfo.HeaderInfos.Select(s => s.Name).Distinct().ToList());
                    }

                    if (this.ExpandSelectQuery != null)
                    {
                        query = this.ExpandSelectQuery(query);
                    }
                    return this.ExcelExport(this.SelectEntities(query), title, entityName);
                }
                else
                {
                    List<IEntityData> entityDataList = this.SelectEntities(this.EntityType.Name, this._QueryRequest.QueryInfo.ProcName, this._QueryRequest.QueryInfo.ParameterList);
                    return this.ExcelExport(entityDataList, title, entityName);
                }
            }
            else
            {
                if (_QueryRequest.IsWidth)
                {
                    Dictionary<string, object> dict = new Dictionary<string, object>();
                    List<IEntityData> entityDataList = this.SelectEntities(query);
                    dict.Add(_Request.Entity.Name, entityDataList);
                    bool hasLabel = false;
                    if (this._QueryRequest.QueryInfo != null)
                    {
                        hasLabel = this._QueryRequest.QueryInfo.HasLabel;
                    }
                    dict.Add("ColumnWidth", Utility.Common.GetColumnWidth(Parse.IEntityToDictionaryList(entityDataList), hasLabel));
                    return dict;
                }
                else
                {
                    return this.SelectEntities(query);
                }
            }
        }

        void QueryPage(IQuery query, IEntityData pageInfo)
        {
            IEntityData selectData = null;
            if (string.IsNullOrEmpty(this._QueryRequest.QueryInfo.ProcName))
            {
                if (string.IsNullOrEmpty(query.ToGroupSql().Trim()))
                {
                    query.Select("count(*) PageRecord");
                    query.GroupBy(string.Empty).Join(string.Empty).OrderBy(string.Empty);
                }
                else
                {
                    query.Select("count(*) PageRecord");
                    query.TableName = string.Format("(select {0} from {1} {2} {3}) a", query.ToSelectSql(), _Request.Entity.TableName + " t" + this.AddWithNoLock(), query.ToWhereSql(), query.ToGroupSql());
                    query.GroupBy(string.Empty).Join(string.Empty).OrderBy(string.Empty).Where(string.Empty, query.ParameterList);
                }

                selectData = this.SelectEntity(query);
            }
            else
            {
                selectData = this.SelectEntity(this._QueryRequest.QueryInfo.ProcName, this._QueryRequest.QueryInfo.ParameterList);
            }

            if (selectData != null)
            {
                int pageRecord = selectData.GetValue<int>("PageRecord");
                int pageCount = 0;
                string pageSizeString = _QueryRequest.GetParameterValue("PageSize");
                string pageIndexString = _QueryRequest.GetParameterValue("PageIndex");
                int pageSize = string.IsNullOrEmpty(pageSizeString) ? 20 : int.Parse(pageSizeString);
                int pageIndex = string.IsNullOrEmpty(pageIndexString) ? 1 : int.Parse(pageIndexString);
                if (pageRecord % pageSize == 0)
                {
                    pageCount = pageRecord / pageSize;
                }
                else
                {
                    pageCount = pageRecord / pageSize + 1;
                }
                pageIndex = pageIndex > pageCount ? pageCount : pageIndex;

                pageInfo.SetValue("PageRecord", pageRecord);
                pageInfo.SetValue("PageIndex", pageIndex);
                pageInfo.SetValue("PageSize", pageSize);
                pageInfo.SetValue("PageCount", pageCount);
            }
        }

        private Dictionary<string, object> ExcelExport(List<IEntityData> entityDataList, string title, string entityName)
        {
            string fileName = Guid.NewGuid().ToString().ToLower();

            Dictionary<string, string> headerDict = new Dictionary<string, string>();
            this._QueryRequest.QueryInfo.HeaderInfos.ForEach(h =>
            {
                headerDict.Add(h.Name, h.Label);
            });

            DataCache.CacheExcelExportData(fileName, Parse.IEntityToDictionaryList(entityDataList), headerDict);

            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("FileName", fileName);
            return dict;
        }

        public object Insert()
        {
            bool blSucceed = true;
            object primaryKey = null;
            if (_Request.Entities.ContainsKey(_Request.Entity.Name) && _Request.Entities[_Request.Entity.Name] != null)
            {
                string message = string.Empty;
                foreach (IEntityData entityData in _Request.Entities[_Request.Entity.Name])
                {
                    AddCreateUser(entityData);
                    message = this.Validate(entityData, this.EntityType.InsertValidateList);
                    if (!string.IsNullOrEmpty(message))
                    {
                        break;
                    }
                }
                if (!string.IsNullOrEmpty(message))
                {
                    return GetMessageDict(message);
                }

                IDbTransaction trans = this.CurrentDataBase.BeginTransaction(this.CurrentDataBase.ConnectionString);

                try
                {
                    foreach (IEntityData entityData in _Request.Entities[_Request.Entity.Name])
                    {
                        blSucceed = this.InsertEntity(entityData, out primaryKey, trans);
                        if (!blSucceed)
                        {
                            break;
                        }
                    }
                    blSucceed = this.CurrentDataBase.CommitTransaction(trans, blSucceed);
                }
                catch(Exception ex)
                {
                    this.CurrentDataBase.CommitTransaction(trans, false);
                    throw ex;
                }

                if (primaryKey != null)
                {
                    Dictionary<string, object> dict = GetBoolDict(blSucceed);
                    dict.Add("PrimaryKey", primaryKey);
                    return dict;
                }
                else
                {
                    return GetBoolDict(blSucceed);
                }
            }
            else
            {
                return GetBoolDict(false);
            }
        }

        public void AddCreateUser(IEntityData entityData)
        {
            var p = this.EntityType.Properties.Where(w => w.Name.Equals("CreateUser")).FirstOrDefault();
            if (p != null) entityData.SetValue(p.Name, this._Request.OperationUser);
        }

        public void AddUpdateUser(IEntityData entityData)
        {
            var p = this.EntityType.Properties.Where(w => w.Name.Equals("UpdateUser")).FirstOrDefault();
            if (p != null) entityData.SetValue(p.Name, this._Request.OperationUser);

            p = this.EntityType.Properties.Where(w => w.Name.Equals("UpdateDate")).FirstOrDefault();
            if (p != null) entityData.SetValue(p.Name, DateTime.Now);
        }

        public object Update()
        {
            if (_Request.Entities.ContainsKey(_Request.Entity.Name) && _Request.Entities[_Request.Entity.Name] != null)
            {
                IEntityData entityData = _Request.Entities[_Request.Entity.Name].FirstOrDefault();
                AddUpdateUser(entityData);
                string message = this.Validate(entityData, this.EntityType.UpdateValidateList);
                if (!string.IsNullOrEmpty(message))
                {
                    return GetMessageDict(message);
                }
                if (entityData.GetValue("RowVersion") != null)
                {
                    IEntityData oldEntityData = this.SelectEntity(_QueryRequest.ToQuery());
                    if (oldEntityData == null)
                    {
                        return GetBoolDict(false);
                    }
                    message = this.CompareVersion(entityData, oldEntityData);
                    if (!string.IsNullOrEmpty(message))
                    {
                        return GetMessageDict(message);
                    }
                }

                return GetBoolDict(this.UpdateEntity(_QueryRequest.ToQuery(), entityData));
            }
            else
            {
                return GetBoolDict(false);
            }
        }

        public object Delete()
        {
            string message = string.Empty;
            if (_Request.Entities != null && _Request.Entities.ContainsKey("Validate") && _Request.Entities["Validate"] != null)
            {
                List<IEntityData> validateEntityDataList = _Request.Entities["Validate"];
                string entityName = string.Empty;
                string filter = string.Empty;
                EntityType entityType = null;
                foreach (IEntityData validateEntityData in validateEntityDataList)
                {
                    entityName = validateEntityData.GetStringValue("EntityName");
                    filter = this.ReplaceOperator(validateEntityData.GetStringValue("Filter"));
                    message = validateEntityData.GetStringValue("Message");
                    entityType = EntityType.GetEntityType(entityName);
                    if (entityType != null)
                    {
                        IQuery query = new Query(entityType.TableName, entityType.Name);
                        query.Select("top 1 1");
                        query.Where(string.Format(" where {0}", filter));
                        if (this.SelectEntity(query) != null)
                        {
                            break;
                        }
                        else
                        {
                            message = string.Empty;
                        }
                    }
                    else
                    {
                        message = string.Format("对不起,实体{0}不存在！", entityName);
                        break;
                    }
                }
            }
            if (!string.IsNullOrEmpty(message))
            {
                return GetMessageDict(message);
            }
            else
            {
                string rowVersion = this._QueryRequest.GetParameterValue("RowVersion");
                if (!string.IsNullOrEmpty(rowVersion))
                {
                    IEntityData entityData = new EntityData(this.EntityType);
                    entityData.SetValue("RowVersion", rowVersion);
                    IEntityData oldEntityData = this.SelectEntity(_QueryRequest.ToQuery());
                    if (oldEntityData == null)
                    {
                        return GetBoolDict(false);
                    }
                    message = this.CompareVersion(entityData, oldEntityData);
                    if (!string.IsNullOrEmpty(message))
                    {
                        return GetMessageDict(message);
                    }
                }
                return GetBoolDict(this.DeleteEntity(_QueryRequest.ToQuery()));
            }
        }

        private string ReplaceOperator(string filter)
        {
            filter = filter.Replace(" eq ", "=");
            filter = filter.Replace(" ne ", "<>");
            filter = filter.Replace(" gt ", ">");
            filter = filter.Replace(" ge ", ">=");
            filter = filter.Replace(" lt ", "<");
            filter = filter.Replace(" le ", "<=");
            return filter;
        }

        public string Validate(IEntityData entityData, List<Func<IValidate, IEntityData, string>> validateList)
        {
            string message = string.Empty;
            if (validateList != null && validateList.Count > 0)
            {
                foreach (Func<IValidate, IEntityData, string> validate in validateList)
                {
                    message = validate(this, entityData);
                    if (!string.IsNullOrEmpty(message))
                    {
                        break;
                    }
                }
            }
            message = message == "true" ? string.Empty : message;
            return message;
        }

        public string Validate()
        {
            string message = string.Empty;
            if (_Request.Entities.ContainsKey("Validate") && _Request.Entities["Validate"] != null)
            {
                IEntityData validateEntityData = _Request.Entities["Validate"].FirstOrDefault();
                string operationType = validateEntityData.GetValue("OperationType").ToString();
                string configName = validateEntityData.GetValue("ConfigName").ToString();
                List<Dictionary<string, object>> judgeHtmlList = validateEntityData.GetValue("JudgeHtml") as List<Dictionary<string, object>>;
                List<Dictionary<string, object>> uniquePropertyList = validateEntityData.GetValue("UniqueProperty") as List<Dictionary<string, object>>;
                foreach (IEntityData entityData in _Request.Entities[_Request.Entity.Name])
                {
                    foreach (Dictionary<string, object> dict in judgeHtmlList)
                    {
                        string propertyName = dict["Name"].ToString();
                        object propertyValue = entityData.GetValue(propertyName);
                        if (propertyValue != null)
                        {
                            message = Utility.Common.JudgeIsHtml(propertyValue.ToString(), dict["Label"].ToString());
                            if (!string.IsNullOrEmpty(message))
                            {
                                break;
                            }
                        }
                    }
                    if (string.IsNullOrEmpty(message))
                    {
                        if (operationType == "Update")
                        {
                            object primaryKey = _QueryRequest.PrimaryKeyProperty.Value;
                            IEntityData updateEntityData = this.SelectEntityByPrimaryKey(primaryKey);
                            if (updateEntityData != null)
                            {
                                if (uniquePropertyList != null)
                                {
                                    uniquePropertyList.ForEach(uniqueProperty =>
                                    {
                                        uniqueProperty.Add("EditPropertyValue", updateEntityData.GetValue(uniqueProperty["Name"].ToString()));
                                    });
                                }
                            }
                            else
                            {
                                message = string.Format("对不起，该{0}不存在！", configName);
                            }
                        }
                        if (string.IsNullOrEmpty(message) && uniquePropertyList != null)
                        {
                            foreach (Dictionary<string, object> uniqueProperty in uniquePropertyList)
                            {
                                string propertyName = uniqueProperty["Name"].ToString();
                                string propertyLabel = uniqueProperty["Label"].ToString();
                                object propertyValue = entityData.GetValue(propertyName);
                                Property property = this._Request.Entity.GetProperty(propertyName);
                                if (propertyValue != null && property != null)
                                {
                                    property.Value = propertyValue;
                                    object editPropertyValue = null;
                                    if (uniqueProperty.ContainsKey("EditPropertyValue"))
                                    {
                                        editPropertyValue = uniqueProperty["EditPropertyValue"];
                                    }
                                    if (editPropertyValue == null || editPropertyValue.ToString().Trim() != propertyValue.ToString().Trim())
                                    {
                                        List<WhereStatement> whereList = new List<WhereStatement>()
                                        {
                                            new WhereStatement(propertyName,"=","@"+ propertyName)
                                        };
                                        List<IDbDataParameter> parameterList = new List<IDbDataParameter>()
                                        {
                                            this.GetInParameter(property)
                                        };
                                        IQuery query = new Query(this._Request.Entity.TableName);
                                        query.Where(whereList, parameterList);
                                        IEntityData editEntityData = this.SelectEntity(query);
                                        if (editEntityData != null)
                                        {
                                            message = string.Format("对不起，该{0}已存在！", propertyLabel);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return message;
        }

        public string ValidateExists<T>(IEntityData entityData, string filter, string message, bool blExists = true) where T : IEntity
        {
            EntityType entityType = EntityType.GetEntityType<T>();
            if (entityType != null)
            {
                IQuery query = new Query(entityType.TableName, entityType.Name);
                query.Select(entityType.PrimaryKey);
                query.Where(string.Format(" where {0}", filter), this.GetFileterParameterList(entityData, entityType, filter));
                if (this.SelectEntity(query) != null)
                {
                    if (!blExists)
                    {
                        message = string.Empty;
                    }
                }
                else
                {
                    if (blExists)
                    {
                        message = string.Empty;
                    }
                }
            }
            return message;
        }

        private List<IDbDataParameter> GetFileterParameterList(IEntityData entityData, EntityType entityType, string filter)
        {

            List<Property> propertyList = (from property in entityType.Properties
                                           where filter.IndexOf("@" + property.Name) > 0
                                           select new Property
                                           {
                                               Name = property.Name,
                                               ParameterName = property.ParameterName,
                                               Type = property.Type,
                                               IsSelect = property.IsSelect
                                           }).ToList();
            if (propertyList.Count > 0)
            {
                List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
                propertyList.ForEach(property =>
                {
                    property.Value = Common.ChangeType(entityData.GetValue(property.Name), property.Type);
                    parameterList.Add(this.GetInParameter(property));
                });
                return parameterList;
            }
            return null;
        }

        public string InsertValidateUnique<T>(IEntityData entityData, string propertyName, string message) where T : IEntity
        {
            EntityType entityType = EntityType.GetEntityType<T>();
            if (entityType != null)
            {
                Property property = entityType.GetProperty(propertyName);
                if (property != null)
                {
                    object propertyValue = Common.ChangeType(entityData.GetValue(property.Name), property.Type);
                    IQuery query = new Query(entityType.TableName, entityType.Name);
                    property.Value = propertyValue;
                    List<IDbDataParameter> parameterList = new List<IDbDataParameter>()
                    {
                      this.GetInParameter(property)
                    };
                    query.Where(string.Format(" where {0}=@{0}", propertyName), parameterList);
                    if (this.SelectEntity(query) == null)
                    {
                        message = string.Empty;
                    }
                }
                return message;
            }
            return string.Empty;
        }

        public string UpdateValidateUnique<T>(IEntityData entityData, string propertyName, string message) where T : IEntity
        {
            EntityType entityType = EntityType.GetEntityType<T>();
            if (entityType != null)
            {
                Property property = entityType.GetProperty(propertyName);
                Property primaryKeyProperty = entityType.GetProperty(entityType.PrimaryKey);
                if (property != null)
                {
                    object propertyValue = Common.ChangeType(entityData.GetValue(property.Name), property.Type);
                    IQuery query = new Query(entityType.TableName, entityType.Name);
                    property.Value = propertyValue;
                    primaryKeyProperty.Value = Common.ChangeType(entityData.GetValue(primaryKeyProperty.Name), primaryKeyProperty.Type);
                    List<IDbDataParameter> parameterList = new List<IDbDataParameter>()
                    {
                        this.GetInParameter(property),
                        this.GetInParameter(primaryKeyProperty)
                    };
                    query.Where(string.Format(" where {0}=@{0} and {1}=@{1}", entityType.PrimaryKey, propertyName), parameterList);
                    if (this.SelectEntity(query) != null)
                    {
                        message = string.Empty;
                    }
                    else
                    {
                        parameterList = new List<IDbDataParameter>()
                        {
                           this.GetInParameter(property)
                        };
                        query.Where(string.Format(" where {0}=@{0}", propertyName), parameterList);
                        if (this.SelectEntity(query) == null)
                        {
                            message = string.Empty;
                        }
                    }
                }
                return message;
            }
            return string.Empty;
        }
    }
}
