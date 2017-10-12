using EntityDataService.Data;
using EntityDataService.Entity;
using EntityDataService.Service;
using EntityDataService.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenDataFramework.Component
{
    public interface IDataAccess
    {
        object Query();
        object Create();
        object Update();
        object Delete();
        object ExcelImport(List<string> columnNameList, List<List<Dictionary<string, string>>> dataList);
        string GetPageJs(string name);
        string GetSource(string name, string type);
        string GetKeyValue(string key);
    }

    public class DataAccess : IDataAccess
    {
        private Request _request;
        private Entity.IBaseRequest _requestData;
        private RequestEntity _requestEntity;
        private string _requestType;
        private EntityRequest _entityReqeust;
        private Guid _opeartionUserId = Guid.Empty;
        private IEntityData _loginUser = null;
        private int _dataRight;

        public DataAccess()
        {
            _entityReqeust = new EntityRequest();
        }

        public DataAccess(Request request)
        {
            _request = request;
            _entityReqeust = new EntityRequest();
        }

        private IDbDataParameter InParameter(string parameterName, object value)
        {
            return value == null ? this._entityReqeust.InParameter(parameterName, DBNull.Value) : this._entityReqeust.InParameter(parameterName, value);
        }

        private Dictionary<string, object> GetResponse(string message)
        {
            return this.GetResponse(message, null);
        }

        private Dictionary<string, object> GetResponse(object obj)
        {
            if (obj is string) return this.GetResponse(obj.ToString());
            return this.GetResponse(string.Empty, obj);
        }

        private Dictionary<string, object> GetResponse(string message, object obj)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            Dictionary<string, object> ack = new Dictionary<string, object>();

            ack.Add("IsSuccess", string.IsNullOrEmpty(message));
            ack.Add("StatusCode", string.IsNullOrEmpty(message) ? 0 : 102);
            ack.Add("StatusMessage", message ?? string.Empty);

            dict.Add("Ack", ack);
            dict.Add("Data", obj);

            return dict;
        }

        private Entity.IBaseRequest GetRequestData()
        {
            switch (this._requestType)
            {
                case "Query": return JsonParse.JsonToTo<Entity.BaseRequest<Entity.QueryRequest>>(this._request.Content);
                case "Create":
                case "Update":
                case "Delete": return JsonParse.JsonToTo<Entity.BaseRequest<Entity.EditRequest>>(this._request.Content);
                default: return null;
            }
        }

        private string ValidateRequest()
        {
            this._requestData = this.GetRequestData();
            if (this._requestData == null)
            {
                return "请求报文不能为空！";
            }

            if (string.IsNullOrEmpty(this._requestData.EntityName))
            {
                return "请求实体名不能为空！";
            }

            this._request.EntityName = this._requestData.EntityName;
            this._request.RequestType = this._requestType;

            if (this._requestData.IRequest == null)
            {
                return "请求实体内容不能为空！";
            }

            this._requestEntity = RequestEntityType.GetRequestEntity(this._requestData.EntityName);
            if (this._requestEntity == null)
            {
                return "请求实体不存在！";
            }

            return this.ValidateUser();
        }

        private string ValidateUser()
        {
            if (!string.IsNullOrEmpty(this._request.OperationUser))
            {
                this._opeartionUserId = Guid.Parse(this._request.OperationUser);

                this._loginUser = new User().SelectEntityByPrimaryKey(this._opeartionUserId);
                if (this._loginUser == null) return "登录用户不存在或过期，请重新登录再试！";
            }
            else if (!(this._request.IsLogin && this._requestEntity.EntityName == "User" && this._requestType == "Query"))
            {
                return "登录用户不存在或过期，请重新登录再试！";
            }

            return string.Empty;
        }

        private void SetUserRight(Entity.QueryRequest request)
        {
            if (this._requestType != "Query") return;
            if (!request.IsDataRight) return;

            string loginName = this._loginUser.GetStringValue("LoginName");
            List<string> adminNameList = this.StringSplit(this.GetKeyValue("管理员"));
            List<string> adminNameList2 = this.StringSplit(this.GetKeyValue("数据管理员"));
            if (adminNameList.Contains(loginName) || adminNameList2.Contains(loginName))
            {
                this._dataRight = 4;
            }
            else
            {
                Guid departId = this._loginUser.GetValue<Guid>("DepartId");
                this._dataRight = this._loginUser.GetValue<int>("DataRight");
                if (this._dataRight == 0) this._dataRight = 1;
                if (departId == Guid.Empty && this._dataRight == 2) this._dataRight = 1;
            }
        }

        private List<string> StringSplit(string str)
        {
            return str.Split(new char[] { ',', ';', '，', '；' }).ToList();
        }

        public object Query()
        {
            this._requestType = "Query";
            return this.Request();
        }

        public object Create()
        {
            this._requestType = "Create";
            return this.Request();
        }

        public object Update()
        {
            this._requestType = "Update";
            return this.Request();
        }

        public object Delete()
        {
            this._requestType = "Delete";
            return this.Request();
        }

        private object Request()
        {
            string message = this.ValidateRequest();
            if (!string.IsNullOrEmpty(message))
            {
                return this.GetResponse(message);
            }

            object obj = this.EntityRequest();
            if (obj == null)
            {
                return this.GetResponse("请求方法未实现！");
            }

            return this.GetResponse(obj);
        }

        private object EntityRequest()
        {
            switch (this._requestType)
            {
                case "Query": return this.QueryAction();
                case "Create":
                case "Update": return this.EditAction();
                case "Delete": return this.DeleteAction();
                default: return null;
            }
        }

        private object DeleteAction()
        {
            Entity.EditRequest request = this._requestData.IRequest as Entity.EditRequest;
            IEntityData response = new EntityData(this._requestData.EntityName);

            List<Guid> idList = request.Data.Select(s => s.GetValue<Guid>(this._requestEntity.PrimaryKey)).ToList();

            List<IEntityData> oldEntityDataList = this.GetEntityDataByIdList(idList);
            var list = (from a in request.Data
                        from b in oldEntityDataList
                        where a.GetValue<Guid>(this._requestEntity.PrimaryKey) == b.GetValue<Guid>(this._requestEntity.PrimaryKey)
                        select new { a, b });

            if (list.Count() != request.Data.Count)
            {
                return "删除数据中有不存在数据，请刷新再试！";
            }

            string message = string.Empty;
            foreach (var c in list)
            {
                message = this._entityReqeust.CompareVersion(new EntityData(c.a), c.b);
                if (!string.IsNullOrEmpty(message)) break;
            }

            if (!this.SetEntityIsDelete(idList))
            {
                return "删除失败！";
            }

            if (this._requestEntity.EntityType != null && this._requestEntity.EntityName.Equals("DataEntity"))
            {
                RequestEntityType.RemoveRequestEntity(idList[0]);
            }

            if (this._requestEntity.EntityType == null)
            {
                DataOperationLog.AddDataOperationLog(this._requestEntity, this._request, this._loginUser, idList, "Delete", null);
            }

            response.SetValue("IsDelete", true);

            return response;
        }

        private bool SetEntityIsDelete(List<Guid> idList)
        {
            string sql = string.Format("update {0} set IsDelete=1", this._requestEntity.MainTableName);
            if (this._requestEntity.EntityType == null)
            {
                sql += string.Format(",ModifyUser='{0}',ModifyDate=getdate()", this._opeartionUserId);
            }

            sql += string.Format(" where {0} in ({1})", this._requestEntity.PrimaryKey, string.Join(",", idList.Select(s => "'" + s.ToString() + "'")));
            return this._entityReqeust.CurrentDataBase.ExecSqlNonQuery(sql);
        }

        private List<IEntityData> GetEntityDataByIdList(List<Guid> idList)
        {
            IQuery query = new Query(this._requestEntity.MainTableName);
            query.Select(new List<string>() { this._requestEntity.PrimaryKey, "RowVersion" });
            query.Where(string.Format("where {0} in ({1})", this._requestEntity.PrimaryKey, string.Join(",", idList.Select(s => "'" + s.ToString() + "'"))));
            return this._entityReqeust.SelectEntities(query);
        }

        private List<IEntityData> GetEntityTableDataByIdList(EntityType entityType, List<Guid> idList)
        {
            IQuery query = new Query(entityType.TableName);
            query.Select(new List<string>() { "DataId" });
            query.Where(string.Format("where DataId in ({0})", string.Join(",", idList.Select(s => "'" + s.ToString() + "'"))));
            return this._entityReqeust.SelectEntities(query);
        }

        private object EditAction()
        {
            Entity.EditRequest request = this._requestData.IRequest as Entity.EditRequest;
            if (request.Data == null || request.Data.Count == 0)
            {
                return "请求更新数据不存在！";
            }

            IEntityData response = new EntityData(this._requestData.EntityName);
            response.SetValue("RequestType", this._requestType);

            if (this._requestEntity.EntityType != null)
            {
                this._request.Entities = new Dictionary<string, List<IEntityData>>();
                this._request.Entities.Add(this._request.EntityName, Parse.DictionaryListToIEntityList(Parse.ParseDictionaryList(request.Data)));
                this._request.Entity = this._requestEntity.EntityType;

                Guid primaryKey = Guid.Empty;
                if (this._requestType == "Update")
                {
                    primaryKey = request.Data[0].GetValue<Guid>(this._requestEntity.PrimaryKey);
                    this._request.PathAndQuery = string.Format("{0}({1})", this._request.EntityName, primaryKey);
                }

                DataEntity dataEntity = null;
                object obj = null;
                if (this._requestEntity.EntityType.Name == "User")
                {
                    obj = new User(this._request).EditEntity();
                }
                else if (this._requestEntity.EntityType.Name == "DataEntity")
                {
                    dataEntity = new DataEntity(this._request);
                    obj = dataEntity.EditEntity();
                }

                Dictionary<string, object> dict = obj as Dictionary<string, object>;
                if (dict != null)
                {
                    if (!string.IsNullOrEmpty(dict.GetStringValue("Succeed")))
                    {
                        if (dict.ContainsKey("PrimaryKey"))
                        {
                            primaryKey = dict.GetValue<Guid>("PrimaryKey");
                        }
                        response.SetValue("Ids", primaryKey);

                        if (dataEntity != null) dataEntity.UpdateRequestEntity(primaryKey);

                        return response;
                    }
                    else
                    {
                        string message = dict.GetStringValue("Message");
                        return string.IsNullOrEmpty(message) ? dict.GetStringValue("Exception") : message;
                    }
                }

                return null;
            }

            return this.EditEntityData(request.Data, response);
        }

        private object EditEntityData(List<Dictionary<string, object>> dataList, IEntityData response)
        {
            response = response ?? new EntityData(this._request.EntityName);

            EntityType entityDataTable = EntityType.GetEntityType<Entity.EntityDataTable>();
            EntityType intDataTable = EntityType.GetEntityType<Entity.IntDataTable>();
            EntityType dateDataTable = EntityType.GetEntityType<Entity.DateDataTable>();
            EntityType floatDataTable = EntityType.GetEntityType<Entity.FloatDataTable>();
            EntityType guidDataTable = EntityType.GetEntityType<Entity.GuidDataTable>();
            EntityType stringDataTable = EntityType.GetEntityType<Entity.StringDataTable>();
            EntityType expandStringTable = EntityType.GetEntityType<Entity.ExpandStringTable>();

            List<IEntityData> oldGuidEntityDataList = new List<IEntityData>();
            List<IEntityData> oldIntEntityDataList = new List<IEntityData>();
            List<IEntityData> oldDateEntityDataList = new List<IEntityData>();
            List<IEntityData> oldFloatEntityDataList = new List<IEntityData>();
            List<IEntityData> oldStringEntityDataList = new List<IEntityData>();
            List<IEntityData> oldExpandStringEntityDataList = new List<IEntityData>();

            List<Guid> idList = null;

            if (this._requestType == "Create")
            {
                dataList.ForEach(d =>
                {
                    d["DataId"] = Guid.NewGuid();
                    d["EntityId"] = this._requestEntity.EntityId;
                    d["CreateUser"] = this._opeartionUserId;
                    d["CreateDate"] = DateTime.Now;
                });
            }
            else
            {
                dataList.ForEach(d =>
                {
                    d["ModifyUser"] = this._opeartionUserId;
                    d["ModifyDate"] = DateTime.Now;
                });

                idList = dataList.Select(s => s.GetValue<Guid>(this._requestEntity.PrimaryKey)).ToList();

                List<IEntityData> oldEntityDataList = this.GetEntityDataByIdList(idList);
                var list = (from a in dataList
                            from b in oldEntityDataList
                            where a.GetValue<Guid>(this._requestEntity.PrimaryKey) == b.GetValue<Guid>(this._requestEntity.PrimaryKey)
                            select new { a, b });

                if (list.Count() != dataList.Count)
                {
                    return "更新数据中有不存在数据，请刷新再试！";
                }

                string message = string.Empty;
                foreach (var c in list)
                {
                    message = this._entityReqeust.CompareVersion(new EntityData(c.a), c.b);
                    if (!string.IsNullOrEmpty(message)) break;
                }
                if (!string.IsNullOrEmpty(message)) return message;

                oldGuidEntityDataList = this.GetEntityTableDataByIdList(guidDataTable, idList);
                oldIntEntityDataList = this.GetEntityTableDataByIdList(intDataTable, idList);
                oldDateEntityDataList = this.GetEntityTableDataByIdList(dateDataTable, idList);
                oldFloatEntityDataList = this.GetEntityTableDataByIdList(floatDataTable, idList);
                oldStringEntityDataList = this.GetEntityTableDataByIdList(stringDataTable, idList);
                oldExpandStringEntityDataList = this.GetEntityTableDataByIdList(expandStringTable, idList);
            }

            List<IEntityData> entityDataList = new List<IEntityData>();
            List<IEntityData> guidEntityDataList = new List<IEntityData>();
            List<IEntityData> intEntityDataList = new List<IEntityData>();
            List<IEntityData> dateEntityDataList = new List<IEntityData>();
            List<IEntityData> floatEntityDataList = new List<IEntityData>();
            List<IEntityData> stringEntityDataList = new List<IEntityData>();
            List<IEntityData> expandStringEntityDataList = new List<IEntityData>();

            dataList.ForEach(d =>
            {
                //EntityDataTable
                entityDataList.Add(this.GetDataTableEntityData(entityDataTable, d));

                //GuidDataTable
                guidEntityDataList.Add(this.GetTypeDataTableEntityData(guidDataTable, d));

                //intDataTable
                intEntityDataList.Add(this.GetTypeDataTableEntityData(intDataTable, d));

                //dateDataTable
                dateEntityDataList.Add(this.GetTypeDataTableEntityData(dateDataTable, d));

                //floatDataTable
                floatEntityDataList.Add(this.GetTypeDataTableEntityData(floatDataTable, d));

                //stringDataTable
                stringEntityDataList.Add(this.GetTypeDataTableEntityData(stringDataTable, d));

                //ExpandStringTable
                expandStringEntityDataList.Add(this.GetTypeDataTableEntityData(expandStringTable, d));
            });

            if (!string.IsNullOrEmpty(this._requestEntity.KeyNames))
            {
                string message = this.ValidateKeyNamesUnique(dataList, this._requestEntity, this._requestType == "Update");
                if (!string.IsNullOrEmpty(message)) return message;
            }

             List<IEntityData> oldValue = null;

             if (this._requestType == "Update" && idList != null && idList.Count > 0)
             {
                 oldValue = new DataOperationLog().GetDataValue(idList);
             }

            IDbTransaction trans = this._entityReqeust.CurrentDataBase.BeginTransaction(this._entityReqeust.CurrentDataBase.ConnectionString);
            bool blSucceed = true;

            if (this._requestType == "Create")
            {
                //EntityDataTable
                blSucceed = this.InsertList(entityDataTable, entityDataList, trans);
                //GuidDataTable
                if (blSucceed) blSucceed = this.InsertList(guidDataTable, guidEntityDataList, trans);
                //intDataTable
                if (blSucceed) blSucceed = this.InsertList(intDataTable, intEntityDataList, trans);
                //dateDataTable
                if (blSucceed) blSucceed = this.InsertList(dateDataTable, dateEntityDataList, trans);
                //floatDataTable
                if (blSucceed) blSucceed = this.InsertList(floatDataTable, floatEntityDataList, trans);
                //stringDataTable
                if (blSucceed) blSucceed = this.InsertList(stringDataTable, stringEntityDataList, trans);
                //ExpandStringTable
                if (blSucceed) blSucceed = this.InsertList(expandStringTable, expandStringEntityDataList, trans);
            }
            else
            {
                //EntityDataTable
                blSucceed = this.UpdateList(entityDataTable, entityDataList, null, trans);
                //GuidDataTable
                if (blSucceed) blSucceed = this.UpdateList(guidDataTable, guidEntityDataList, oldGuidEntityDataList, trans);
                //intDataTable
                if (blSucceed) blSucceed = this.UpdateList(intDataTable, intEntityDataList, oldIntEntityDataList, trans);
                //dateDataTable
                if (blSucceed) blSucceed = this.UpdateList(dateDataTable, dateEntityDataList, oldDateEntityDataList, trans);
                //floatDataTable
                if (blSucceed) blSucceed = this.UpdateList(floatDataTable, floatEntityDataList, oldFloatEntityDataList, trans);
                //stringDataTable
                if (blSucceed) blSucceed = this.UpdateList(stringDataTable, stringEntityDataList, oldStringEntityDataList, trans);
                //ExpandStringTable
                if (blSucceed) blSucceed = this.UpdateList(expandStringTable, expandStringEntityDataList, oldExpandStringEntityDataList, trans);
            }

            blSucceed = this._entityReqeust.CurrentDataBase.CommitTransaction(trans, blSucceed);

            if (blSucceed)
            {
                if (idList == null || idList.Count == 0)
                {
                    idList = dataList.Select(s => s.GetValue<Guid>("DataId")).ToList();
                }
                response.SetValue("Ids", string.Join(",", idList));

                DataOperationLog.AddDataOperationLog(this._requestEntity, this._request, this._loginUser, idList, this._requestType, oldValue);
            }
            else
            {
                return "操作失败！";
            }

            return response;
        }

        private string ValidateKeyNamesUnique(List<Dictionary<string, object>> dataList, RequestEntity entity, bool blUpdate)
        {
            string message = string.Empty;
            List<string> nameList = entity.KeyNames.Split(new char[] { ',', ';', '，', '；' }).ToList();
            Dictionary<string, string> whereDict = null;
            Dictionary<string, string> whereDict2 = null;
            string keyName = string.Empty, keyName2 = string.Empty, value = string.Empty;
            bool blExists = false;
            IEntityData entityData = null;
            foreach (var data in dataList)
            {
                whereDict = new Dictionary<string, string>();
                blExists = false;
                keyName = string.Empty;
                keyName2 = string.Empty;

                nameList.ForEach(n =>
                {
                    value = data.GetStringValue(n);
                    whereDict.Add(n, value);
                    keyName += value;
                });

                if (blUpdate)
                {
                    whereDict2 = new Dictionary<string, string>();
                    whereDict2.Add("DataId", data.GetStringValue("DataId"));
                    entityData = this.GetEntityData(entity.EntityName, whereDict2, nameList);
                    if (entityData != null)
                    {
                        nameList.ForEach(n =>
                        {
                            keyName2 += entityData.GetStringValue(n);
                        });
                        if (string.IsNullOrEmpty(keyName) || keyName == keyName2)
                        {
                            blExists = true;
                        }
                    }
                }

                if (!blExists)
                {
                    entityData = this.GetEntityData(entity.EntityName, whereDict, nameList);
                    if (entityData != null)
                    {
                        message = string.Format("对不起，该{0}已存在", entity.KeyNames);
                        break;
                    }
                }
            }

            return message;
        }

        private bool InsertList(EntityType entityType, List<IEntityData> entityDataList, IDbTransaction trans)
        {
            object primaryKey = null;
            bool blSucceed = true;
            if (entityDataList.Count > 0)
            {
                foreach (var e in entityDataList)
                {
                    if (e.Count > 1) blSucceed = this._entityReqeust.InsertEntity(entityType, e, out primaryKey, trans);
                    if (!blSucceed) break;
                }
            }

            return blSucceed;
        }

        private bool UpdateList(EntityType entityType, List<IEntityData> entityDataList, List<IEntityData> oldEntityDataList, IDbTransaction trans)
        {
            List<Guid> idList = new List<Guid>();
            if (oldEntityDataList != null) idList = oldEntityDataList.Select(s => s.GetValue<Guid>("DataId")).ToList();

            bool blSucceed = true;

            Guid id = Guid.Empty;
            object primaryKey = null;

            if (entityDataList.Count > 0)
            {
                foreach (var e in entityDataList)
                {
                    if (e.Count > 1)
                    {
                        id = e.GetValue<Guid>(entityType.PrimaryKey);
                        if (oldEntityDataList != null && !idList.Contains(id))
                        {
                            blSucceed = this._entityReqeust.InsertEntity(entityType, e, out primaryKey, trans);
                        }
                        else
                        {
                            blSucceed = this._entityReqeust.UpdateEntityByPrimaryKey(entityType, id, e, trans);
                        }
                    }
                    if (!blSucceed) break;
                }
            }

            return blSucceed;
        }

        private IEntityData GetDataTableEntityData(EntityType entityType, Dictionary<string, object> d)
        {
            IEntityData entityData = new EntityData(entityType);

            var list = (from a in d.Keys
                        from b in entityType.Properties
                        where a.ToLower().Trim().Equals(b.Name.ToLower().Trim())
                        select new { a, b });

            foreach (var c in list)
            {
                entityData.SetValue(c.b.Name, d[c.a]);
            }

            return entityData;

        }
        private IEntityData GetTypeDataTableEntityData(EntityType entityType, Dictionary<string, object> d)
        {
            IEntityData entityData = new EntityData(entityType);

            var list = (from a in d.Keys
                        from b in this._requestEntity.Properties
                        from c in entityType.Properties
                        where a.ToLower().Trim().Equals(b.PropertyName.ToLower().Trim())
                        && b.FieldName.ToLower().Trim().Equals(c.Name.ToLower().Trim())
                        select new { a, b });

            foreach (var c in list)
            {
                entityData.SetValue(c.b.FieldName, d[c.a]);
            }

            return entityData;
        }

        private IEntityData QueryData(RequestEntity requestEntity, Entity.QueryRequest request, bool hasRowVersion)
        {
            IEntityData response = new EntityData(requestEntity.EntityName);

            List<string> tableNameList = new List<string>();
            List<string> groupByNameList = new List<string>();
            List<string> fieldList = this.GetFieldList(requestEntity, request, groupByNameList, tableNameList);
            List<Entity.QueryRequest.SqlGroupBy> groupbyList = this.GetGroupByList(requestEntity, request);
            List<string> havingList = new List<string>();

            tableNameList.AddRange(groupbyList.Select(s => s.TableName).Distinct());

            fieldList.AddRange(groupbyList.Select(s => string.Format("{0} \"{1}\"", s.Expression, s.AsName)));
            if (fieldList.Count == 0)
            {
                throw new Exception("查询属性名集合为空！");
            }
            if (groupbyList.Count == 0 && !request.IsExcel && hasRowVersion)
            {
                fieldList.Add("t.RowVersion");
            }

            if (groupbyList.Count == 0 && (request.IsDataRight || request.IsDataStatus) && !request.IsExcel && requestEntity.EntityType == null)
            {
                fieldList.Add("t.CreateUser");
            }

            if (groupbyList.Count == 0 && request.IsDataStatus && !request.IsExcel && requestEntity.EntityType == null)
            {
                fieldList.Add("t.DataStatus");
                fieldList.Add("case when t.DataStatus=0 then '未提交' when t.DataStatus=1 then '已提交' when t.DataStatus=2 then '驳回' else '' end DataStatusName");
            }

            string fieldSql = string.Join(",", fieldList.Distinct());

            string orderbySql = this.GetOrderBySql(requestEntity, request, groupByNameList, tableNameList);

            if (groupbyList.Count == 0)
            {
                groupByNameList = new List<string>();
            }

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            string whereSql = this.GetWhereSql(requestEntity, request, groupbyList, havingList, parameterList, tableNameList);

            string tableSql = string.Format("from {0}", this.GetTableSql(request, requestEntity, tableNameList.Distinct().Where(w => !string.IsNullOrEmpty(w) && !w.ToLower().Trim().Equals(requestEntity.MainTableName.ToLower().Trim())).ToList()));

            string groubySql = groupbyList.Count == 0 ? string.Empty : string.Format("group by {0}", string.Join(",", groupByNameList));
            string havingSql = havingList.Count == 0 ? string.Empty : string.Format("having {0}", string.Join(" and ", havingList));

            List<string> sqlList = new List<string>() { tableSql, whereSql, groubySql, havingSql };
            string sql = string.Join(" ", sqlList.Where(w => !string.IsNullOrEmpty(w)));

            int pageRecord = 0;
            List<IEntityData> dataList = null;

            if (request.IsPage && request.PageIndex == 1 && !request.IsExcel)
            {
                List<IDbDataParameter> parameterList2 = new List<IDbDataParameter>();
                parameterList.ForEach(p =>
                {
                    parameterList2.Add(this.InParameter(p.ParameterName, p.Value));
                });

                Parallel.Invoke(() =>
                {
                    pageRecord = this.GetQueryRecord(sql, parameterList, fieldSql, !string.IsNullOrEmpty(groubySql));
                },
                () =>
                {
                    dataList = this.GetQueryData(request, fieldSql, sql, parameterList2, orderbySql);
                });

                response.SetValue("PageRecord", pageRecord);
                response.SetValue("DataList", dataList);
            }
            else
            {
                if (request.IsExcel)
                {
                    response.SetValue("FileName", this.ExcelExport(request, this.GetQueryData(request, fieldSql, sql, parameterList, orderbySql)));
                }
                else
                {
                    dataList = this.GetQueryData(request, fieldSql, sql, parameterList, orderbySql);

                    if (request.ComplexQueryList != null && request.ComplexQueryList.Count > 0)
                    {
                        request.ComplexQueryList.ForEach(c =>
                        {
                            this.SetComplexQueryData(dataList, c, requestEntity.PrimaryKey);
                        });
                    }

                    response.SetValue("DataList", dataList);
                }
            }

            return response;
        }

        private void SetComplexQueryData(List<IEntityData> dataList, Entity.QueryRequest request, string primaryKey)
        {
            RequestEntity requestEntity = RequestEntityType.GetRequestEntity(request.EntityName);
            if (requestEntity == null) throw new Exception("复合查询请求实体不存在！");

            IEntityData data = this.QueryData(requestEntity, request, false);
            List<IEntityData> complexDataList = data.GetValue("DataList") as List<IEntityData>;
            if (complexDataList != null && complexDataList.Count > 0)
            {
                foreach (var d in dataList)
                {
                    d.SetValue(request.PropertyName, complexDataList.Where(w => w.GetValue<Guid>(primaryKey) == d.GetValue<Guid>(primaryKey)).ToList());
                }
            }
        }

        private IEntityData QueryAction()
        {
            Entity.QueryRequest request = this._requestData.IRequest as Entity.QueryRequest;
            this.SetUserRight(request);
            return this.QueryData(this._requestEntity, request, request.IsRowVersion);
        }

        private string ExcelExport(Entity.QueryRequest request, List<IEntityData> entityDataList)
        {
            Dictionary<string, string> headerDict = new Dictionary<string, string>();
            request.HeaderInfos.ForEach(h =>
            {
                headerDict.Add(h.Name, h.Label);
            });

            if (this._requestEntity.EntityType == null)
            {
                this.SetGuidTextValue(entityDataList, headerDict);
            }

            string fileName = "F" + DateTime.Now.Millisecond.ToString() + new Random().Next(10000, 100000).ToString();
            fileName = request.Title + fileName;

            DataCache.CacheExcelExportData(fileName, Parse.IEntityToDictionaryList(entityDataList), headerDict);

            return EntityDataService.Utility.FileHelper.Encrypt(fileName);
        }

        private void SetGuidTextValue(List<IEntityData> entityDataList, Dictionary<string, string> headerDict)
        {
            List<RequestProperty> propertyList = this._requestEntity.Properties.Where(w => w.IsConfig && w.DataType == "guid").ToList();

            if (propertyList.Count > 0)
            {
                List<List<IEntityData>> batchList = Common.ListToBatchList<IEntityData>(entityDataList, 1000);

                propertyList.ForEach(p =>
                {
                    headerDict.Add(p.PropertyName + "_文本", p.PropertyName + "_文本");
                    SetPropertyGuidTextValue(batchList, p);
                });
            }
        }

        private void SetPropertyGuidTextValue(List<List<IEntityData>> batchList, RequestProperty property)
        {
            List<Guid> guidValueList = new List<Guid>();
         
            ParallelOptions po = new ParallelOptions();
            po.MaxDegreeOfParallelism = 5;

            Parallel.ForEach(batchList, po, (list) =>
            {
                this.GetGuidValueList(list, property.PropertyName, guidValueList);
            });

            guidValueList = guidValueList.Distinct().ToList();

            RequestEntity entity = this.GetRequesetEntity(guidValueList);
            if (entity == null) return;

            List<List<Guid>> guidBatchList = Common.ListToBatchList<Guid>(guidValueList, 200);

            List<IEntityData> entityDataList = new List<IEntityData>();

            Parallel.ForEach(guidBatchList, po, (list) =>
            {
                entityDataList.AddRange(this.QueryEntityDataByIdList(entity, list));
            });

            Parallel.ForEach(batchList, po, (list) =>
            {
                this.SetPropertyGuidTextValue(list, entityDataList, property.PropertyName, entity);
            });
        }

        private void SetPropertyGuidTextValue(List<IEntityData> dataList, List<IEntityData> entityDataList, string propertyName, RequestEntity entity)
        {
            var list = (from a in dataList
                        from b in entityDataList
                        where a.GetValue<Guid>(propertyName) == b.GetValue<Guid>("DataId")
                        select new { a, b }).ToList();

            foreach (var c in list)
            {
                c.a.SetValue(propertyName + "_文本", this.GetPropertyGuidTextValue(entity, c.b));
            }
        }

        internal string GetPropertyGuidTextValue(RequestEntity entity, IEntityData entityData)
        {
            List<string> valueList = new List<string>();
            string value = string.Empty;
            entity.KeyNames.Split(new char[] { ',', ';', '，', '；' }).ToList().ForEach(n =>
            {
                value = entityData.GetStringValue(n);
                if (!string.IsNullOrEmpty(value)) valueList.Add(value);
            });

            return string.Join("/", valueList);
        }

        internal List<IEntityData> QueryEntityDataByIdList(RequestEntity entity, List<Guid> idList)
        {
            Entity.QueryRequest request = new Entity.QueryRequest();
            request.EntityName = entity.EntityName;
            request.SelectNames = new List<string>() { "DataId" };
            request.SelectNames.AddRange(entity.KeyNames.Split(new char[] { ',', ';', '，', '；' }));
            request.Conditions = new List<Entity.QueryRequest.Condition>();
            request.Conditions.Add(new Entity.QueryRequest.Condition() { Name = "DataId", Logic = "in", Value = string.Join(",", idList) });

            IEntityData entityData = this.QueryData(entity, request, false);
            return entityData.GetValue<List<IEntityData>>("DataList");
        }

        internal RequestEntity GetRequesetEntity(List<Guid> guidValueList)
        {
            if (guidValueList.Count == 0) return null;

            return new EntityDataTable().GetRequestEntity(guidValueList[0]);
        }

        private void GetGuidValueList(List<IEntityData> dataList, string propertyName, List<Guid> guidValueList)
        {
            guidValueList.AddRange(dataList.Where(w => w.GetValue<Guid>(propertyName) != Guid.Empty).Select(s => s.GetValue<Guid>(propertyName)).Distinct());
        }

        private int GetQueryRecord(string sql, List<IDbDataParameter> parameterList, string fieldSql, bool blGroupBy)
        {
            if (blGroupBy)
            {
                sql = string.Format("select count(*) PageRecord from (select {0} {1}) a", fieldSql, sql);
            }
            else
            {
                sql = string.Format("select count(*) PageRecord {0}", sql);
            }

            IQuery query = new Query(string.Empty);
            query.SetSql(sql, parameterList);

            IEntityData entityData = new EntityRequest().SelectEntity(query);
            return entityData == null ? 0 : entityData.GetValue<int>("PageRecord");
        }

        private List<IEntityData> GetQueryData(Entity.QueryRequest request, string fieldSql, string sql, List<IDbDataParameter> parameterList, string orderbySql)
        {
            if (request.IsPage)
            {
                request.PageSize = request.PageSize < 1 ? 10 : request.PageSize;
                request.PageIndex = request.PageIndex < 1 ? 1 : request.PageIndex;

                StringBuilder sb = new StringBuilder();
                sb.AppendFormat("select * from (select row_number() over({0}) as rn,{1} {2}) a", orderbySql, fieldSql, sql);
                sb.AppendFormat(" where a.rn > {0} and a.rn <= {1}", (request.PageIndex - 1) * request.PageSize, request.PageIndex * request.PageSize);

                sql = sb.ToString();
            }
            else
            {
                if (request.TopCount > 0)
                {
                    fieldSql = string.Format("top {0} {1}", request.TopCount, fieldSql);
                }
                sql = string.Format("select {0} {1} {2}", fieldSql, sql, orderbySql);
            }

            IQuery query = new Query(string.Empty);
            query.SetSql(sql, parameterList);

            return new EntityRequest().SelectEntities(query);
        }

        private string GetTableSql(Entity.QueryRequest request, RequestEntity requestEntity, List<string> tableNameList)
        {
            string t = RequestEntity.GetAsTableName(requestEntity.MainTableName);
            List<string> tableList = new List<string>() { string.Format("{0} {1} with(nolock)", requestEntity.MainTableName, t) };

            if (request.IsDataRight && this._dataRight == 2)
            {
                tableList.Add(string.Format("inner join t_d_User u with(nolock) on {0}.CreateUser=u.UserId and u.DepartId='{1}'", t, this._loginUser.GetValue<Guid>("DepartId")));
            }
            else if (request.IsDataRight && this._dataRight == 3)
            {
                tableList.Add(string.Format("inner join t_d_User u with(nolock) on {0}.CreateUser=u.UserId", t));
            }

            if (tableNameList.Count > 0)
            {
                tableNameList.ForEach(n =>
                {
                    tableList.Add(string.Format("left join {0} {1} with(nolock) on {2}.{3}={1}.{3}", n, RequestEntity.GetAsTableName(n), t, requestEntity.PrimaryKey));
                });
            }

            return string.Join(" ", tableList);
        }


        private List<string> GetFieldList(RequestEntity requestEntity, Entity.QueryRequest request, List<string> groupByNameList, List<string> tableNameList)
        {
            List<string> fieldList = new List<string>();
            request.SelectNames = request.SelectNames ?? new List<string>();
            List<RequestProperty> propertyList = (from a in request.SelectNames
                                                  from b in requestEntity.Properties
                                                  where a.ToLower().Trim().Equals(b.PropertyName.ToLower().Trim())
                                                  select b).ToList();

            propertyList = this.RevomeNoSelectProperty(requestEntity, propertyList);

            propertyList.ForEach(p =>
            {
                tableNameList.Add(p.TableName);
                groupByNameList.Add(string.Format("{0}.{1}", p.AsTableName, p.FieldName));
                fieldList.Add(string.Format("{0}.{1} \"{2}\"", p.AsTableName, p.FieldName, p.PropertyName));
            });

            return fieldList;
        }

        private List<RequestProperty> RevomeNoSelectProperty(RequestEntity requestEntity, List<RequestProperty> propertyList)
        {
            if (requestEntity.EntityName.ToLower().Trim().Equals("user"))
            {
                propertyList = propertyList.Where(w => w.PropertyName != "LoginPassword").ToList();
            }
            return propertyList;
        }

        private List<Entity.QueryRequest.SqlGroupBy> GetGroupByList(RequestEntity requestEntity, Entity.QueryRequest request)
        {
            List<string> logicList = new List<string>() { "count", "sum", "max", "min", "avg" };
            request.GroupBys = request.GroupBys ?? new List<Entity.QueryRequest.GroupBy>();

            return (from a in request.GroupBys
                    from b in requestEntity.Properties
                    from c in logicList
                    where a.Name.ToLower().Trim().Equals(b.PropertyName.ToLower().Trim())
                    && a.Logic.ToLower().Trim().Equals(c)
                    select new Entity.QueryRequest.SqlGroupBy()
                    {
                        AsName = a.AsName,
                        TableName = b.TableName,
                        FieldName = string.Format("{0}.{1}", b.AsTableName, b.FieldName),
                        Expression = string.Format("{0}({1}.{2})", a.Logic, b.AsTableName, b.FieldName)
                    }).ToList();
        }

        private string GetOrderBySql(RequestEntity requestEntity, Entity.QueryRequest request, List<string> groupByNameList, List<string> tableNameList)
        {
            if (request.OrderBys == null || request.OrderBys.Count == 0)
            {
                return string.Format("order by t.{0}", requestEntity.PrimaryKey);
            }

            var list = (from a in request.OrderBys
                        from b in requestEntity.Properties
                        where a.Name.ToLower().Trim().Equals(b.PropertyName.ToLower().Trim())
                        select new { a, b });

            List<string> orderList = new List<string>();
            foreach (var c in list)
            {
                tableNameList.Add(c.b.TableName);
                groupByNameList.Add(string.Format("{0}.{1}", c.b.AsTableName, c.b.FieldName));
                orderList.Add(string.Format("{0}.{1}{2}", c.b.AsTableName, c.b.FieldName, c.a.IsDesc ? " desc" : string.Empty));
            }

            return string.Concat("order by ", string.Join(",", orderList));
        }

        private string GetWhereSql(RequestEntity requestEntity, Entity.QueryRequest request, List<Entity.QueryRequest.SqlGroupBy> groupbyList, List<string> havingList, List<IDbDataParameter> parameterList, List<string> tableNameList)
        {
            List<string> whereList = this.GetConditionList(requestEntity, request.Conditions, groupbyList, havingList, parameterList, tableNameList);

            if (requestEntity.EntityName != "DataProperty")
            {
                whereList.Insert(0, "t.IsDelete=0");
            }

            string pName = string.Empty;
            if (requestEntity.EntityType == null)
            {
                pName = "@P" + Guid.NewGuid().ToString().Substring(0, 8);
                parameterList.Add(this.InParameter(pName, requestEntity.EntityId));
                whereList.Insert(0, string.Format("t.EntityId={0}", pName));
            }

            if (request.IsDataRight && this._dataRight == 1)
            {
                pName = "@P" + Guid.NewGuid().ToString().Substring(0, 8);
                parameterList.Add(this.InParameter(pName, this._opeartionUserId));
                whereList.Add(string.Format("t.CreateUser={0}", pName));
            }
            else if (request.IsDataRight && this._dataRight == 3)
            {
                pName = "@P" + Guid.NewGuid().ToString().Substring(0, 8);
                parameterList.Add(this.InParameter(pName, this._opeartionUserId));
                whereList.Add(string.Format("(t.CreateUser={0} or u.DataRight<3 or u.DataRight is null)", pName));
            }

            if (request.IsDataStatus)
            {
                pName = "@P" + Guid.NewGuid().ToString().Substring(0, 8);
                parameterList.Add(this.InParameter(pName, this._opeartionUserId));
                whereList.Add(string.Format("(t.CreateUser={0} or t.DataStatus=1)", pName));
            }

            return string.Format("where {0}", string.Join(" and ", whereList));
        }

        private string GetCondtionSql(RequestEntity requestEntity, Entity.QueryRequest.Condition condition, List<Entity.QueryRequest.SqlGroupBy> groupbyList, List<string> havingList, List<IDbDataParameter> parameterList, List<string> tableNameList)
        {
            string logic = condition.Logic.ToLower().Trim();
            if (string.IsNullOrEmpty(condition.Value) && logic != "and" && logic != "or" && logic != "isnull" && logic != "notnull") return string.Empty;

            switch (logic)
            {
                case "and":
                case "or":
                    if (condition.Conditions == null || condition.Conditions.Count == 0)
                    {
                        return string.Empty;
                    }
                    return string.Format("({0})", string.Join(string.Format(" {0} ", condition.Logic), this.GetConditionList(requestEntity, condition.Conditions, groupbyList, havingList, parameterList, tableNameList)));
                case "isnull":
                case "notnull":
                    {
                        RequestProperty p = this.GetRequestProperty(requestEntity, condition.Name);
                        if (p == null) return string.Empty;

                        tableNameList.Add(p.TableName);
                        return string.Format("{0}.{1} is {2}", p.AsTableName, p.FieldName, logic == "isnull" ? "null" : "not null");
                    }
                case "in":
                case "notin":
                    {
                        condition.Logic = condition.Logic == "notin" ? "not in" : condition.Logic;
                        string pName = "@P" + Guid.NewGuid().ToString().Substring(0, 8);
                        RequestProperty p = this.GetRequestProperty(requestEntity, condition.Name);
                        if (p != null)
                        {
                            tableNameList.Add(p.TableName);

                            string[] values = condition.Value.Split(new char[] { ',', '，' });
                            List<string> pNameList = new List<string>();
                            string name = string.Empty;

                            for (var i = 0; i < values.Length; i++)
                            {
                                name = string.Format("{0}_{1}", pName, i + 1);
                                parameterList.Add(this.InParameter(name, values[i].Trim()));
                                pNameList.Add(name);
                            }

                            return string.Format("{0}.{1} {2} ({3})", p.AsTableName, p.FieldName, condition.Logic, string.Join(",", pNameList));
                        }
                        return string.Empty;
                    }
                case "like":
                    {
                        var pList = (from a in requestEntity.Properties
                                     from b in condition.Name.Split(new char[] { ',', '，' })
                                     where a.PropertyName.ToLower().Trim().Equals(b.ToLower().Trim())
                                     select a);
                        List<string> likeList = new List<string>();

                        string pName = string.Empty;
                        pList.ToList().ForEach(p =>
                        {
                            tableNameList.Add(p.TableName);

                            pName = "@P" + Guid.NewGuid().ToString().Substring(0, 8);
                            parameterList.Add(this.InParameter(pName, string.Format("%{0}%", condition.Value)));
                            likeList.Add(string.Format("{0}.{1} {2} {3}", p.AsTableName, p.FieldName, condition.Logic, pName));
                        });

                        return likeList.Count == 0 ? string.Empty : likeList.Count == 1 ? likeList[0] : string.Format("({0})", string.Join(" or ", likeList));
                    }
                default:
                    {
                        if (logic == "<" && condition.Value.Length == 10)
                        {
                            DateTime dateValue = DateTime.MinValue;
                            if (DateTime.TryParse(condition.Value, out dateValue))
                            {
                                condition.Value = dateValue.AddDays(1).ToString("yyyy-MM-dd");
                            }
                        }

                        string pName = "@P" + Guid.NewGuid().ToString().Substring(0, 8);
                        RequestProperty p = this.GetRequestProperty(requestEntity, condition.Name);
                        if (p == null)
                        {
                            Entity.QueryRequest.SqlGroupBy groupby = groupbyList.Where(w => w.AsName.ToLower().Trim().Equals(condition.Name.ToLower().Trim())).FirstOrDefault();
                            if (groupby != null)
                            {
                                parameterList.Add(this.InParameter(pName, condition.Value));
                                havingList.Add(string.Format("{0} {1} {2}", groupby.Expression, condition.Logic, pName));
                            }
                        }
                        else
                        {
                            tableNameList.Add(p.TableName);

                            parameterList.Add(this.InParameter(pName, condition.Value));
                            return string.Format("{0}.{1} {2} {3}", p.AsTableName, p.FieldName, condition.Logic, pName);
                        }
                        return string.Empty;
                    }
            }
        }

        private RequestProperty GetRequestProperty(RequestEntity requestEntity, string name)
        {
            return requestEntity.Properties.Where(w => w.PropertyName.ToLower().Trim().Equals(name.ToLower().Trim())).FirstOrDefault();
        }

        private List<string> GetConditionList(RequestEntity requestEntity, List<Entity.QueryRequest.Condition> conditionList, List<Entity.QueryRequest.SqlGroupBy> groupbyList, List<string> havingList, List<IDbDataParameter> parameterList, List<string> tableNameList)
        {
            if (conditionList == null || conditionList.Count == 0) return new List<string>();

            List<string> whereList = new List<string>();
            List<string> logicList = new List<string>() { "=", ">=", ">", "<=", "<", "in", "and", "or", "like", "notin", "isnull", "notnull", "<>" };
            conditionList = (from a in conditionList
                             from b in logicList
                             where a.Logic.ToLower().Equals(b)
                             select a).ToList();

            string whereSql = string.Empty;
            conditionList.ForEach(c =>
            {
                whereSql = this.GetCondtionSql(requestEntity, c, groupbyList, havingList, parameterList, tableNameList);
                if (!string.IsNullOrEmpty(whereSql))
                {
                    whereList.Add(whereSql);
                }
            });

            return whereList;
        }

        private List<string> GetColumnNameList(List<string> columnNameList, out Dictionary<string, string> dict)
        {
            dict = null;
            switch (this._request.EntityName.ToLower().Trim())
            {
                case "user":
                    {
                        dict = Entity.User.GetPropertyMapField();
                        return this.GetEntityTypeColumnNameList(columnNameList, dict);
                    }
                default: return columnNameList;
            }
        }

        private List<string> GetEntityTypeColumnNameList(List<string> columnNameList, Dictionary<string, string> dict)
        {
            List<string> list = new List<string>();

            var keyList = (from a in columnNameList
                           from b in dict.Keys
                           where a.ToLower().Trim().Equals(b.ToLower().Trim())
                           select a);

            foreach (var key in keyList)
            {
                list.Add(dict[key]);
            }
            return list;
        }

        private string GetEntityPropertyName(string name, Dictionary<string, string> proeprtyFieldDict)
        {
            if (proeprtyFieldDict == null) return name;

            foreach (var kvp in proeprtyFieldDict)
            {
                if (kvp.Key.ToLower().Trim().Equals(name.ToLower().Trim()))
                {
                    return kvp.Value;
                }
            }

            return name;
        }

        public object ExcelImport(List<string> columnNameList, List<List<Dictionary<string, string>>> dataList)
        {
            this._requestType = "Create";
            this._requestEntity = RequestEntityType.GetRequestEntity(this._request.EntityName);
            if (this._requestEntity == null) return this.GetResponse("请求实体不存在！");

            string message = this.ValidateUser();
            if (!string.IsNullOrEmpty(message)) return this.GetResponse(message);

            Dictionary<string, string> proeprtyFieldDict = null;
            columnNameList = this.GetColumnNameList(columnNameList, out proeprtyFieldDict);

            IEntityData response = new EntityData(this._request.EntityName);

            List<RequestProperty> propertyList = (from a in columnNameList
                                                  from b in this._requestEntity.Properties
                                                  where a.ToLower().Trim().Equals(b.PropertyName.ToLower().ToLower())
                                                  select b).ToList();
            if (propertyList.Count == 0) return this.GetResponse("Excel对应的属性名都不存在！");

            int iCount = dataList.Sum(s => s.Count());
            if (iCount > 5000) return this.GetResponse("导入的行数超过5000！");

            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            Dictionary<string, object> data = null;
            dataList.ForEach(d =>
            {
                d.ForEach(dict =>
                {
                    data = new Dictionary<string, object>();
                    foreach (var kvp in dict)
                    {
                        data.Add(this.GetEntityPropertyName(kvp.Key, proeprtyFieldDict), kvp.Value);
                    }

                    dictList.Add(data);
                });
            });

            List<Dictionary<string, object>> messageList = new List<Dictionary<string, object>>();
            Dictionary<string, object> msgDict = null;
            object obj = null;
            List<string> msgList = null;

            iCount = 0;
            for (int i = 0; i < dictList.Count; i++)
            {
                msgList = new List<string>();

                try
                {
                    if (this._requestEntity.EntityType != null)
                    {
                        if (this._requestEntity.EntityType.Name == "User")
                        {
                            obj = new User().ExcelInsert(dictList[i]);
                        }
                    }
                    else
                    {
                        obj = this.EditEntityData(new List<Dictionary<string, object>>() { dictList[i] }, null);
                    }
                    if (obj is string)
                    {
                        msgList.Add(obj.ToString());
                    }
                    else
                    {
                        iCount += 1;
                    }
                }
                catch (Exception ex)
                {
                    msgList.Add(Common.GetInnerException(ex).Message);
                }

                if (msgList.Count > 0)
                {
                    msgDict = new Dictionary<string, object>();
                    msgDict.Add("RowNum", i + 1);
                    msgDict.Add("Message", msgList);
                    messageList.Add(msgDict);
                }
            }

            if (iCount > 0)
            {
                message = string.Format("操作成功，成功导入{0}条数据！", iCount);
            }

            if (messageList.Count > 0)
            {
                response.SetValue("MessageList", this.GetReturnMessageList(messageList));
            }
            else if (string.IsNullOrEmpty(message))
            {
                message = "导入失败！";
            }

            if (!string.IsNullOrEmpty(message))
            {
                response.SetValue("Message", message);
            }

            return this.GetResponse(response);
        }

        private void AddMessage(List<string> msgList, Dictionary<string, string> dict, string name, string msg)
        {
            msgList.Add(string.Format("{0}:{1}（{2}）", name, dict.GetValue(name), msg));
        }

        private List<Dictionary<string, object>> GetReturnMessageList(List<Dictionary<string, object>> messageList)
        {
            messageList = (from a in messageList
                           where a.GetValue<List<string>>("Message").Count > 0
                           select a).ToList();
            messageList.ForEach(m =>
            {
                m["Message"] = string.Join("；", m.GetValue<List<string>>("Message"));
            });

            return messageList;
        }

        private List<IEntityData> GetEntityDataList(string entityName, Dictionary<string, string> whereDict, List<string> selectNames = null)
        {
            RequestEntity entity = RequestEntityType.GetRequestEntity(entityName);
            if (entity == null) return null;

            Entity.QueryRequest request = new Entity.QueryRequest();
            request.EntityName = entity.EntityName;
            request.SelectNames = selectNames == null ? entity.Properties.Where(w => w.IsConfig).Select(s => s.PropertyName).ToList() : selectNames;
            request.Conditions = new List<Entity.QueryRequest.Condition>();
            foreach (var kvp in whereDict) request.Conditions.Add(new Entity.QueryRequest.Condition() { Name = kvp.Key, Logic = "=", Value = kvp.Value });

            IEntityData entityData = this.QueryData(entity, request, false);
            return entityData.GetValue<List<IEntityData>>("DataList");
        }

        private IEntityData GetEntityData(string entityName, Dictionary<string, string> whereDict, List<string> selectNames = null)
        {
            List<IEntityData> entityDataList = this.GetEntityDataList(entityName, whereDict, selectNames);
            return entityDataList == null ? null : entityDataList.FirstOrDefault();
        }

        private IEntityData GetPageEntityData(string name)
        {
            Dictionary<string, string> whereDict = new Dictionary<string, string>();
            whereDict.Add("名称", name);
            return this.GetEntityData("页面", whereDict);
        }

        public string GetPageJs(string name)
        {
            IEntityData entityData = this.GetPageEntityData(name);
            if (entityData == null) return string.Empty;

            Guid entityId = entityData.GetValue<Guid>("表单");
            if (entityId == Guid.Empty) return string.Empty;

            RequestEntity entity = RequestEntityType.RequestEntityList.Where(w => w.EntityId == entityId).FirstOrDefault();
            if (entity == null) return string.Empty;

            IEntityData pageEntityData = new EntityData(string.Empty);
            pageEntityData.SetValue("Name", name);
            pageEntityData.SetValue("PageName", "ListPage");
            string value = entityData.GetStringValue("操作权限");
            Dictionary<string, object> dict = JsonParse.JsonToDictionary(value);
            if (dict != null) foreach (var kvp in dict) if (!Common.GetBoolValue(kvp.Value)) pageEntityData.SetValue(kvp.Key, false);

            List<Dictionary<string, object>> searchDictList = this.GetPageLayoutPropertyList(entityData, "查询字段布局");
            List<Dictionary<string, object>> dataDictList = this.GetPageLayoutPropertyList(entityData, "数据列字段布局");
            List<Dictionary<string, object>> editDictList = this.GetPageLayoutPropertyList(entityData, "编辑字段布局");

            IEntityData entityEntityData = new EntityData(entity.EntityName);
            entityEntityData.SetValue("Name", entity.EntityName);
            entityEntityData.SetValue("PrimaryKey", entity.PrimaryKey);

            List<IEntityData> propertyList = new List<IEntityData>();
            IEntityData property = null;
            Guid dataSourceId = Guid.Empty;
            entity.Properties.Where(w => w.IsConfig).ToList().ForEach(p =>
            {
                property = new EntityData("property");
                property.SetValue("Name", p.PropertyName);
                if (p.DataType == "string") property.SetValue("MaxLength", p.MaxLength);
                if (p.IsNullable == 0) property.SetValue("IsNullable", false);
                property.SetValue("DataType", p.DataType);
                if (p.PropertyName.Equals("CreateDate"))
                {
                    property.SetValue("DataType", "date");
                    property.SetValue("Label", "创建时间");
                }

                dataSourceId = Guid.Empty;
                this.SetPropertyOptions(property, searchDictList, p, "SearchOptions", ref dataSourceId);
                this.SetPropertyOptions(property, dataDictList, p, "DataOptions", ref dataSourceId);
                this.SetPropertyOptions(property, editDictList, p, "EditOptions", ref dataSourceId);

                if (dataSourceId != Guid.Empty) this.SetPropertyDataSource(property, dataSourceId);
               
                propertyList.Add(property);
            });
            entityEntityData.SetValue("Properties", propertyList);

            pageEntityData.SetValue("Entity", entityEntityData);

            StringBuilder sb = new StringBuilder();
            sb.Append("(function(w){");
            sb.AppendFormat("w.PageEntityConfigs={0};", Parse.ToJson(pageEntityData));
            sb.Append("})(window);");

            return sb.ToString();
        }

        private IEntityData GetDataSourceEntityData(Guid dataSourceId)
        {
            Dictionary<string, string> whereDict = new Dictionary<string, string>();
            whereDict.Add("DataId", dataSourceId.ToString());
            return this.GetEntityData("数据源", whereDict);
        }

        private void SetPropertyDataSource(IEntityData property, Guid dataSourceId)
        {
            IEntityData entityData = this.GetDataSourceEntityData(dataSourceId);
            if (entityData == null) return;

            string options = entityData.GetStringValue("选项集");
            if (!string.IsNullOrEmpty(options))
            {
                List<Dictionary<string, object>> optionList = JsonParse.JsonToDictionaryList(options);
                if (optionList == null) return;

                optionList.ForEach(p => { if (p.ContainsKey("Id")) p.Remove("Id"); });
                property.SetValue("Options", optionList);
            }
            else 
            {
                Guid entityId = entityData.GetValue<Guid>("表单");
                if (entityId == Guid.Empty) return;

                RequestEntity entity = RequestEntityType.RequestEntityList.Where(w => w.EntityId == entityId).FirstOrDefault();
                if (entity == null) return;

                IEntityData dataSource = new EntityData(string.Empty);
                dataSource.SetValue("EntityName", entity.EntityName);
                dataSource.SetValue("ValueName", "DataId");
                dataSource.SetValue("TextName", entity.KeyNames);
                dataSource.SetValue("SelectNames", ("DataId," + entity.KeyNames).Split(new char[] { ',', '，', ';', '；' }).ToList());

                property.SetValue("DataSource", dataSource);
            }
        }

        private List<Dictionary<string, object>> GetPageLayoutPropertyList(IEntityData entityData, string name)
        {
            List<Dictionary<string, object>> dictList = JsonParse.JsonToDictionaryList(entityData.GetStringValue(name));
            dictList = dictList ?? new List<Dictionary<string, object>>();
            return dictList;
        }

        private void SetPropertyOptions(IEntityData property, List<Dictionary<string, object>> dictList, RequestProperty p, string name, ref Guid dataSourceId)
        {
            Dictionary<string, object> dict = dictList.Where(w => w.GetValue<Guid>("PropertyId") == p.PropertyId).FirstOrDefault();
            if (dict != null)
            {
                Dictionary<string, object> dict2 = new Dictionary<string, object>();
                foreach (var kvp in dict)
                {
                    if (kvp.Key != "Id" && kvp.Key != "PropertyId" && kvp.Key != "Point" && kvp.Key != "DataSourceId")
                    {
                        dict2.Add(kvp.Key, kvp.Value);
                    }
                    else if (kvp.Key.Equals("DataSourceId") && dataSourceId == Guid.Empty && kvp.Value != null)
                    {
                        dataSourceId = Guid.Parse(kvp.Value.ToString());
                    }
                }
                property.SetValue(name, dict2);
            }
        }

        private IEntityData GetSourceEntityData(string name, string type)
        {
            Dictionary<string, string> whereDict = new Dictionary<string, string>();
            whereDict.Add("名称", name);
            whereDict.Add("类型", type);
            return this.GetEntityData("资源", whereDict, new List<string>() { "内容" });
        }

        public string GetSource(string name, string type)
        {
            IEntityData entityData = this.GetSourceEntityData(name, type);
            if (entityData == null) return string.Empty;

            return entityData.GetStringValue("内容");
        }

        private IEntityData GetKeyValueEntityData(string key)
        {
            Dictionary<string, string> whereDict = new Dictionary<string, string>();
            whereDict.Add("键名", key);
            return this.GetEntityData("键值配置", whereDict, new List<string>() { "值" });
        }

        public string GetKeyValue(string key)
        {
            IEntityData entityData = this.GetKeyValueEntityData(key);
            if (entityData == null) return string.Empty;

            return Common.RemoveEnterOrWhiteSpace(entityData.GetStringValue("值"));
        }
    }

}
