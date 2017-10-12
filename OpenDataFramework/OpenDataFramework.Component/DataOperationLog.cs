using EntityDataService.Data;
using EntityDataService.Entity;
using EntityDataService.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenDataFramework.Component
{
    public class DataOperationLog : EntityRequest
    {
        private List<IEntityData> _oldValue { get; set; }
        private List<IEntityData> _newValue { get; set; }

        EntityType _entityDataTable { get; set; }
        EntityType _intDataTable { get; set; }
        EntityType _dateDataTable { get; set; }
        EntityType _floatDataTable { get; set; }
        EntityType _guidDataTable { get; set; }
        EntityType _stringDataTable { get; set; }
        EntityType _expandStringTable { get; set; }

        public DataOperationLog()
        {
            this.EntityType = EntityDataService.Entity.EntityType.GetEntityType<OpenDataFramework.Entity.DataOperationLog>();

            _entityDataTable = EntityType.GetEntityType<Entity.EntityDataTable>();
            _intDataTable = EntityType.GetEntityType<Entity.IntDataTable>();
            _dateDataTable = EntityType.GetEntityType<Entity.DateDataTable>();
            _floatDataTable = EntityType.GetEntityType<Entity.FloatDataTable>();
            _guidDataTable = EntityType.GetEntityType<Entity.GuidDataTable>();
            _stringDataTable = EntityType.GetEntityType<Entity.StringDataTable>();
            _expandStringTable = EntityType.GetEntityType<Entity.ExpandStringTable>();
        }

        public DataOperationLog(Request request)
            : base(request)
        {
        }

        public static async void AddDataOperationLog(RequestEntity requestEntity, Request request, IEntityData loginUser, List<Guid> idList, string operationType, List<IEntityData> oldValue)
        {
            try
            {
                await Task.Run(() => { new DataOperationLog().AddDataOperationLog2(requestEntity, request, loginUser, idList, operationType, oldValue); });
            }
            catch
            {
            }
        }

        public void AddDataOperationLog2(RequestEntity requestEntity, Request request, IEntityData loginUser, List<Guid> idList, string operationType, List<IEntityData> oldValue)
        {
            this._oldValue = this.GetEntityDataList(oldValue, requestEntity);
            if (operationType != "Delete") this._newValue = this.GetEntityDataList(this.GetDataValue(idList), requestEntity);
            else this._oldValue = this.GetEntityDataList(this.GetDataValue(idList), requestEntity);

            Guid userId = loginUser == null ? Guid.Empty : loginUser.GetValue<Guid>("UserId");
            string userName = loginUser == null ? string.Empty : string.Format("{0}({1})", loginUser.GetStringValue("UserName"), loginUser.GetStringValue("LoginName"));

            List<IEntityData> dataList = this._oldValue == null ? this._newValue : this._oldValue;

            List<Entity.DataOperationLog> logList = new List<Entity.DataOperationLog>();
            List<Entity.DataOperationTableLog> tableLogList = new List<Entity.DataOperationTableLog>();
            List<Entity.DataOperationFieldLog> fieldLogList = new List<Entity.DataOperationFieldLog>();
            Entity.DataOperationTableLog tableLog = null;
            IEntityData newEntityData = null;
            string ov = string.Empty, nv = string.Empty;
            object objValue = null;

            foreach (var a in dataList)
            {
                logList.Add(new Entity.DataOperationLog()
                {
                    EntityName = requestEntity.EntityName,
                    LogId = Guid.NewGuid(),
                    MethodName = operationType,
                    OperationIP = request.IPAddress,
                    CreateDate = DateTime.Now,
                    OperationName = operationType == "Create" ? "创建" : operationType == "Update" ? "更新" : operationType == "Delete" ? "删除" : "",
                    OperationUser = userId,
                    UserName = userName
                });
                tableLog = new Entity.DataOperationTableLog()
                {
                    LogId = logList[logList.Count - 1].LogId,
                    LogType = (byte)(operationType == "Create" ? 1 : operationType == "Update" ? 2 : operationType == "Delete" ? 3 : 0),
                    PrimaryKey = a.GetValue<Guid>(requestEntity.PrimaryKey),
                    TableLogId = Guid.NewGuid(),
                    TableName = requestEntity.EntityName
                };
                tableLogList.Add(tableLog);

                if (operationType == "Create" || operationType == "Delete")
                {
                    foreach (var kvp in a.ToDictionary())
                    {
                        ov = kvp.Value == null ? string.Empty : kvp.Value.ToString();

                        if (kvp.Key != requestEntity.PrimaryKey && kvp.Value != null)
                        {
                            if (kvp.Value is Guid)
                            {
                                ov = GetGuidText(kvp.Key, (Guid)kvp.Value);
                            }
                            fieldLogList.Add(new Entity.DataOperationFieldLog()
                            {
                                FieldLogId = Guid.NewGuid(),
                                FieldName = kvp.Key,
                                NewValue = operationType == "Create" ? ov : string.Empty,
                                OldValue = operationType == "Delete" ? ov : string.Empty,
                                TableLogId = tableLog.TableLogId
                            });
                        }
                    }
                }
                else
                {
                    newEntityData = this._newValue.Where(w => w.GetValue<Guid>(requestEntity.PrimaryKey) == a.GetValue<Guid>(requestEntity.PrimaryKey)).FirstOrDefault();
                    foreach (var kvp in a.ToDictionary())
                    {
                        ov = kvp.Value == null ? string.Empty : kvp.Value.ToString();

                        objValue = newEntityData == null ? null : newEntityData.GetValue(kvp.Key);
                        nv = objValue == null ? string.Empty : objValue.ToString();

                        if (kvp.Key != requestEntity.PrimaryKey && ov != nv)
                        {
                            if (objValue is Guid)
                            {
                                nv = GetGuidText(kvp.Key, (Guid)objValue);
                            }
                            if (kvp.Value is Guid)
                            {
                                ov = GetGuidText(kvp.Key, (Guid)kvp.Value);
                            }

                            fieldLogList.Add(new Entity.DataOperationFieldLog()
                            {
                                FieldLogId = Guid.NewGuid(),
                                FieldName = kvp.Key,
                                NewValue = nv,
                                OldValue = ov,
                                TableLogId = tableLog.TableLogId
                            });
                        }
                    }
                }
            }

            this.InsertLogList(logList);

            new DataOperationTableLog().InsertLogList(tableLogList);

            new DataOperationFieldLog().InsertLogList(fieldLogList);
        }

        private void InsertLogList(List<Entity.DataOperationLog> entityList)
        {
            object primaryKey = null;
            List<string> fieldList = this.EntityType.Properties.Select(s => s.Name).ToList();

            entityList.ForEach(e =>
            {
                this.InsertEntity(e, fieldList, out primaryKey);
            });
        }

        private List<IEntityData> GetEntityDataList(List<IEntityData> dataList, RequestEntity requestEntity)
        {
            if (dataList == null) return null;

            List<IEntityData> entityDataList = new List<IEntityData>();
            IEntityData entityData = null;

            var groupby = dataList.GroupBy(g => g.GetValue<Guid>(requestEntity.PrimaryKey));

            foreach (var g in groupby)
            {
                entityData = new EntityData(requestEntity.EntityName);

                foreach (var g2 in g)
                {
                    foreach (var kvp in g2.ToDictionary())
                    {
                        entityData.SetValue(kvp.Key, kvp.Value);
                    }
                }

                entityDataList.Add(entityData);
            }

            List<IEntityData> entityDataList2 = new List<IEntityData>();

            entityDataList.ForEach(d =>
            {
                entityData = new EntityData(requestEntity.EntityName);

                requestEntity.Properties.Where(w => w.IsConfig && w.FieldName != "CreateDate").ToList().ForEach(p =>
                {
                    entityData.SetValue(p.PropertyName, d.GetValue(p.FieldName));
                });

                entityData.SetValue(requestEntity.PrimaryKey, d.GetValue(requestEntity.PrimaryKey));
                entityData.SetValue("状态", this.GetDataStatusName(d.GetValue<int>("DataStatus")));

                entityDataList2.Add(entityData);
            });

            return entityDataList2;
        }

        private string GetDataStatusName(int dataStatus)
        {
            switch (dataStatus)
            {
                case 1: return "已提交";
                case 2: return "驳回";
                default: return "未提交";
            }
        }

        public List<IEntityData> GetDataValue(List<Guid> idList)
        {
            List<IEntityData> entityDataList = new List<IEntityData>();

            entityDataList.AddRange(this.GetEntityDataById(this._dateDataTable, idList));
            entityDataList.AddRange(this.GetEntityDataById(this._entityDataTable, idList));
            entityDataList.AddRange(this.GetEntityDataById(this._expandStringTable, idList));
            entityDataList.AddRange(this.GetEntityDataById(this._floatDataTable, idList));
            entityDataList.AddRange(this.GetEntityDataById(this._guidDataTable, idList));
            entityDataList.AddRange(this.GetEntityDataById(this._intDataTable, idList));
            entityDataList.AddRange(this.GetEntityDataById(this._stringDataTable, idList));

            return entityDataList;
        }

        private  List<IEntityData> GetEntityDataById(EntityType entityType, List<Guid> idList)
        {
            IQuery query = new Query(entityType.TableName, entityType.Name);
            query.Where(string.Format("where {0} in ({1})", entityType.PrimaryKey, string.Join(",", idList.Select(s => string.Format("'{0}'", s)))));
            return this.SelectEntities(query);
        }

        private string GetGuidText(string propertyName, Guid value)
        {
            DataAccess dataAccess = new DataAccess();

            List<Guid> guidValueList = new List<Guid>() { value };
            RequestEntity entity = dataAccess.GetRequesetEntity(guidValueList);
            if (entity == null) return string.Empty;

            IEntityData entityData = dataAccess.QueryEntityDataByIdList(entity, guidValueList).FirstOrDefault();
            if (entityData == null) return string.Empty;

            return dataAccess.GetPropertyGuidTextValue(entity, entityData);
        }
    }
}
