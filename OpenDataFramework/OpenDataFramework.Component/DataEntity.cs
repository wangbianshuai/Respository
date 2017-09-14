using EntityDataService.Data;
using EntityDataService.Entity;
using EntityDataService.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EntityDataService.Utility;
using System.Data;

namespace OpenDataFramework.Component
{
    public class DataEntity : EntityRequest
    {
        private DataProperty _dataProperty;
        private EntityType _dataPropertyEntityType;
        private EntityType _entityDataTable;

        public DataEntity()
        {
            this.EntityType = EntityDataService.Entity.EntityType.GetEntityType<OpenDataFramework.Entity.DataEntity>();
            _entityDataTable = EntityDataService.Entity.EntityType.GetEntityType<OpenDataFramework.Entity.EntityDataTable>();
            _dataProperty = new DataProperty();
        }

        public DataEntity(Request request)
            : base(request)
        {
            _dataPropertyEntityType = EntityDataService.Entity.EntityType.GetEntityType<OpenDataFramework.Entity.DataProperty>();
            _entityDataTable = EntityDataService.Entity.EntityType.GetEntityType<OpenDataFramework.Entity.EntityDataTable>();
            _dataProperty = new DataProperty();
        }

        private List<IEntityData> GetDataEntityList()
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("EntityId,EntityName,KeyNames");
            return this.SelectEntities(query);
        }

        public List<RequestEntity> GetRequestEntityList()
        {
            List<IEntityData> dataEntityList = this.GetDataEntityList();
            List<IEntityData> dataPropetyList = this._dataProperty.GetDataPropertyList(Guid.Empty);

            List<RequestProperty> propertyList = Parse.IEntityDataListTo<RequestProperty>(dataPropetyList);

            List<RequestEntity> requestEntityList = (from a in dataEntityList
                                                     from b in propertyList.GroupBy(g => g.EntityId)
                                                     where a.GetValue<Guid>("EntityId") == b.Key
                                                     select new RequestEntity
                                                     {
                                                         EntityId = a.GetValue<Guid>("EntityId"),
                                                         PrimaryKey = "DataId",
                                                         EntityName = a.GetStringValue("EntityName"),
                                                         MainTableName = "t_d_DataTable",
                                                         KeyNames = a.GetStringValue("KeyNames"),
                                                         Properties = b.Concat(this.GetMainTablePropertyList()).ToList()
                                                     }).ToList();


            return requestEntityList;
        }

        private List<RequestProperty> GetMainTablePropertyList()
        {
            return (from a in _entityDataTable.Properties
                    select new RequestProperty()
                    {
                        EntityId = Guid.Empty,
                        FieldName = a.Name,
                        PropertyId = a.Name.Equals("CreateDate") ? new Guid("A2FACD99-F429-4833-9173-B5E0CB5BF3F6") : Guid.NewGuid(),
                        PropertyName = a.Name,
                        IsConfig = a.Name.Equals("CreateDate"),
                        TableName = _entityDataTable.TableName
                    }).ToList();
        }

        public void UpdateRequestEntity(Guid id)
        {
            IEntityData dataEntity = this.SelectEntityByPrimaryKey(id);
            List<IEntityData> dataPropetyList = this._dataProperty.GetDataPropertyList(id);

            List<RequestProperty> propertyList = Parse.IEntityDataListTo<RequestProperty>(dataPropetyList);

            RequestEntity requestEntity = new RequestEntity()
            {
                EntityId = dataEntity.GetValue<Guid>("EntityId"),
                PrimaryKey = "DataId",
                EntityName = dataEntity.GetStringValue("EntityName"),
                MainTableName = "t_d_DataTable",
                KeyNames = dataEntity.GetStringValue("KeyNames"),
                Properties = propertyList.Concat(this.GetMainTablePropertyList()).ToList()
            };

            RequestEntityType.UpdateRequestEntity(requestEntity);
        }

        public object EditEntity()
        {
            switch (this._Request.RequestType)
            {
                case "Create": return this.CreateEntity();
                case "Update": return this.UpdateEntity();
                default: return null;
            }
        }

        private object CreateEntity()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();
            if (entityData != null)
            {
                List<Dictionary<string, object>> propertyList = entityData.GetValue<List<Dictionary<string, object>>>("Properties");

                this.SetData(propertyList);
            }

            return EntityByComplexTypeOperation.Insert<DataEntity>(this, _dataPropertyEntityType, "Properties");
        }

        private void SetData(List<Dictionary<string, object>> propertyList, List<string> existsFieldNameList = null)
        {
            var groupby = propertyList.GroupBy(g => g.GetStringValue("DataType"));

            foreach (var g in groupby)
            {
                switch (g.Key.ToLower().Trim())
                {
                    case "string": { this.SetStringTableFeildList(g.ToList(), existsFieldNameList); break; }
                    case "guid": { this.SetGuidTableFeildList(g.ToList(), existsFieldNameList); break; }
                    case "int": { this.SetIntTableFeildList(g.ToList(), true, existsFieldNameList); break; }
                    case "float": { this.SetFloatTableFeildList(g.ToList(), true, existsFieldNameList); break; }
                    case "money": { this.SetFloatTableFeildList(g.ToList(), false, existsFieldNameList); break; }
                    case "long": { this.SetIntTableFeildList(g.ToList(), false, existsFieldNameList); break; }
                    case "date": { this.SetDateTableFeildList(g.ToList(), existsFieldNameList); break; }
                }
            }
        }

        private void SetDateTableFeildList(List<Dictionary<string, object>> propertyList, List<string> existsFieldNameList = null)
        {
            string tableName = "t_d_DateDataTable", fieldName = string.Empty, name = "DateValue";

            int index = 0, noIndex = 10;

            propertyList.ForEach(p =>
            {
                if (p.GetValue<int>("IsIndex") == 1 && index < 10)
                {
                    index += 1;
                    index = this.IsExistsFieldName(existsFieldNameList, name, index);

                    if (index <= 10) fieldName = string.Format("{0}{1}", name, index);
                }
                else if (noIndex < 30)
                {
                    noIndex += 1;
                    noIndex = this.IsExistsFieldName(existsFieldNameList, name, noIndex);

                    if (noIndex <= 30) fieldName = string.Format("{0}{1}", name, noIndex);
                }

                p["TableName"] = tableName;
                p["FieldName"] = fieldName;
            });
        }

        private int IsExistsFieldName(List<string> existsFieldNameList, string name, int index)
        {
            if (existsFieldNameList != null)
            {
                if (existsFieldNameList.Contains(string.Format("{0}{1}", name, index)))
                {
                    return IsExistsFieldName(existsFieldNameList, name, index + 1);
                }
            }
            return index;
        }

        private void SetFloatTableFeildList(List<Dictionary<string, object>> propertyList, bool blFloat, List<string> existsFieldNameList = null)
        {
            string tableName = "t_d_FloatDataTable", fieldName = string.Empty, name = blFloat ? "FloatValue" : "MoneyValue";

            int index = 0;
            int maxIndex = blFloat ? 20 : 30;
            propertyList.ForEach(p =>
            {
                if (index < maxIndex)
                {
                    index += 1;
                    index = this.IsExistsFieldName(existsFieldNameList, name, index);

                    if (index <= maxIndex) fieldName = string.Format("{0}{1}", name, index);
                }

                p["TableName"] = tableName;
                p["FieldName"] = fieldName;
            });
        }

        private void SetIntTableFeildList(List<Dictionary<string, object>> propertyList, bool blInt, List<string> existsFieldNameList = null)
        {
            string tableName = "t_d_IntDataTable", fieldName = string.Empty, name = blInt ? "IntValue" : "LongValue";

            int index = 0;

            propertyList.ForEach(p =>
            {
                if (index < 20)
                {
                    index += 1;
                    index = this.IsExistsFieldName(existsFieldNameList, name, index);

                    if (index <= 20) fieldName = string.Format("{0}{1}", name, index);
                }

                p["TableName"] = tableName;
                p["FieldName"] = fieldName;
            });
        }

        private void SetGuidTableFeildList(List<Dictionary<string, object>> propertyList, List<string> existsFieldNameList = null)
        {
            string tableName = "t_d_GuidDataTable", fieldName = string.Empty, name = "GuidValue";

            int index = 0, noIndex = 10;

            propertyList.ForEach(p =>
            {
                if (p.GetValue<int>("IsIndex") == 1 && index < 10)
                {
                    index += 1;
                    index = this.IsExistsFieldName(existsFieldNameList, name, index);

                    if (index <= 10) fieldName = string.Format("{0}{1}", name, index);
                }
                else if (noIndex < 20)
                {
                    noIndex += 1;
                    noIndex = this.IsExistsFieldName(existsFieldNameList, name, noIndex);

                    if (noIndex <= 20) fieldName = string.Format("{0}{1}", name, noIndex);
                }

                p["TableName"] = tableName;
                p["FieldName"] = fieldName;
            });
        }

        private void SetStringTableFeildList(List<Dictionary<string, object>> propertyList, List<string> existsFieldNameList = null)
        {
            string tableName1 = "t_d_StringDataTable", tableName2 = "t_d_ExpandStringTable";

            string tableName = string.Empty, fieldName = string.Empty, name = string.Empty;

            int maxLength = 0;
            int index50 = 0, noIndex50 = 10, index500 = 0, index2000 = 0, index4000 = 0, indexMax = 0;

            int indexCount = propertyList.Where(w => w.GetValue<int>("IsIndex") == 1).Count();
            if (indexCount > 10) indexCount = 10;

            noIndex50 = indexCount;

            propertyList.ForEach(p =>
            {
                maxLength = p.GetValue<int>("MaxLength");
                if (maxLength == 50 || maxLength == 500)
                {
                    tableName = tableName1;
                }
                else
                {
                    tableName = tableName2;
                }

                if (p.GetValue<int>("IsIndex") == 1 && index50 < indexCount && maxLength == 50)
                {
                    name = "Nvarchar50Value";
                    index50 += 1;
                    index50 = this.IsExistsFieldName(existsFieldNameList, name, index50);
                    if (index50 <= 10) fieldName = string.Format("{0}{1}", name, index50);
                }
                else if (maxLength == 50 && noIndex50 < 30)
                {
                    name = "Nvarchar50Value";
                    noIndex50 += 1;
                    noIndex50 = this.IsExistsFieldName(existsFieldNameList, name, noIndex50);
                    if (noIndex50 <= 30) fieldName = string.Format("{0}{1}", name, noIndex50);
                }
                else if (maxLength > 0 && maxLength <= 500 && index500 < 20)
                {
                    name = "Nvarchar500Value";
                    index500 += 1;
                    index500 = this.IsExistsFieldName(existsFieldNameList, name, index500);
                    if (index500 <= 20) fieldName = string.Format("{0}{1}", name, index500);
                }
                else if (maxLength > 0 && maxLength <= 2000 && index2000 < 10)
                {
                    name = "Nvarchar2000Value";
                    index2000 += 1;
                    index2000 = this.IsExistsFieldName(existsFieldNameList, name, index2000);
                    if (index500 <= 10) fieldName = string.Format("{0}{1}", name, index2000);
                }
                else if (maxLength > 0 && maxLength <= 4000 && index4000 < 10)
                {
                    name = "Nvarchar4000Value";
                    index4000 += 1;
                    index4000 = this.IsExistsFieldName(existsFieldNameList, name, index4000);
                    if (index500 <= 10) fieldName = string.Format("{0}{1}", name, index4000);
                }
                else if (maxLength == 0 && indexMax < 10)
                {
                    name = "NvarcharMaxValue";
                    indexMax += 1;
                    indexMax = this.IsExistsFieldName(existsFieldNameList, name, indexMax);
                    if (indexMax <= 10) fieldName = string.Format("{0}{1}", name, indexMax);
                }

                p["TableName"] = tableName;
                p["FieldName"] = fieldName;
            });
        }

        private object UpdateEntity()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();
            if (entityData == null) return null;

            Guid entityId = entityData.GetValue<Guid>(this.EntityType.PrimaryKey);
            bool blDeleteData = entityData.GetValue<bool>("IsDeleteData");

            List<Dictionary<string, object>> propertyList = entityData.GetValue<List<Dictionary<string, object>>>("Properties");
            propertyList.ForEach(p =>
            {
                if (!p.ContainsKey("EntityId"))
                {
                    p["EntityId"] = entityId;
                }
            });

            IEntityData oldEntityData = this.SelectEntityByPrimaryKey(entityId);
            if (oldEntityData == null) return this.GetMessageDict("对不起，更新的数据不存在！");

            string message = this.Validate(entityData, this.EntityType.UpdateValidateList);
            if (!string.IsNullOrEmpty(message)) return GetMessageDict(message);

            if (entityData.GetValue("RowVersion") != null) message = this.CompareVersion(entityData, oldEntityData);
            if (!string.IsNullOrEmpty(message)) return GetMessageDict(message);

            List<IEntityData> oldPropertyList = this.GetDataPropertyList(entityId);

            this.SetUpdatePropertyList(oldPropertyList);

            var updatePropertyList = (from a in propertyList
                                      from b in oldPropertyList
                                      where a.GetValue<Guid>("PropertyId") == b.GetValue<Guid>("PropertyId")
                                      select new { a, b });

            var insertPropertyList = propertyList.Except((from a in propertyList
                                                          from b in oldPropertyList
                                                          where a.GetValue<Guid>("PropertyId") == b.GetValue<Guid>("PropertyId")
                                                          select a)).ToList();

            var deletePropertyList = oldPropertyList.Except((from a in propertyList
                                                             from b in oldPropertyList
                                                             where a.GetValue<Guid>("PropertyId") == b.GetValue<Guid>("PropertyId")
                                                             select b)).ToList();

            List<IEntityData> updatePropertyList2 = new List<IEntityData>();

            string dataType = string.Empty;
            foreach (var c in updatePropertyList)
            {
                dataType = c.a.GetStringValue("DataType").ToLower().Trim();
                if (dataType.Equals("string"))
                {
                    if (c.a.GetValue<int>("MaxLength") == c.b.GetValue<int>("MaxLength") && c.a.GetValue<byte>("IsIndex") == c.b.GetValue<int>("IsIndex"))
                    {
                        foreach (var kvp in c.a)
                        {
                            c.b.SetValue(kvp.Key, kvp.Value);
                        }
                        updatePropertyList2.Add(c.b);
                    }
                    else
                    {
                        insertPropertyList.Add(c.a);
                        deletePropertyList.Add(c.b);
                    }
                }
                else if (dataType.Equals(c.b.GetStringValue("DataType")) && c.a.GetValue<byte>("IsIndex") == c.b.GetValue<int>("IsIndex"))
                {
                    foreach (var kvp in c.a)
                    {
                        c.b.SetValue(kvp.Key, kvp.Value);
                    }
                    updatePropertyList2.Add(c.b);
                }
                else
                {
                    insertPropertyList.Add(c.a);
                    deletePropertyList.Add(c.b);
                }
            }

            List<string> existsFieldNameList = new List<string>();
            updatePropertyList2.ForEach(p =>
            {
                existsFieldNameList.Add(p.GetStringValue("FieldName"));
            });

            this.SetData(insertPropertyList, existsFieldNameList);

     
            IDbTransaction trans = this.CurrentDataBase.BeginTransaction(this.CurrentDataBase.ConnectionString);
            bool blSucceed = true;

            //更新实体
            blSucceed = this.UpdateEntityByPrimaryKey(entityId, entityData, trans);

            //删除属性对应的数据
            if (blSucceed && blDeleteData)
            {
                List<string> deleteDataSqlList = this.GetDeleteDataSqlList(entityId, deletePropertyList);
                foreach (var sql in deleteDataSqlList)
                {
                    blSucceed = this.CurrentDataBase.ExecSqlNonQuery(sql);
                    if (!blSucceed)
                    {
                        break;
                    }
                }
            }

            _dataProperty = new DataProperty();
            //删除属性
            if (blSucceed)
            {
                foreach (var e in deletePropertyList)
                {
                    blSucceed = _dataProperty.DeleteEntityByPrimaryKey(e.GetValue("PropertyId"), trans);
                    if (!blSucceed)
                    {
                        break;
                    }
                }
            }

            //更新属性
            if (blSucceed)
            {
                foreach (var e in updatePropertyList2)
                {
                    blSucceed = _dataProperty.UpdateEntityByPrimaryKey(e.GetValue("PropertyId"), e, trans);
                    if (!blSucceed)
                    {
                        break;
                    }
                }
            }

            //插入属性
            if (blSucceed)
            {
                object propertyId = null;
                foreach (var e in insertPropertyList)
                {
                    blSucceed = _dataProperty.InsertEntity(new EntityData(e, this._dataPropertyEntityType), out propertyId, trans);
                    if (!blSucceed)
                    {
                        break;
                    }
                }
            }

            blSucceed = this.CurrentDataBase.CommitTransaction(trans, blSucceed);

            return this.GetBoolDict(blSucceed);
        }

        private List<string> GetDeleteDataSqlList(Guid entityId, List<IEntityData> deletePropertyList)
        {
            List<string> deleteDataSqlList = new List<string>();
            var groupby = deletePropertyList.GroupBy(g => g.GetStringValue("DataType"));

            foreach (var g in groupby)
            {
                switch (g.Key.ToLower().Trim())
                {
                    case "string":
                        {
                            var groupby2 = g.GroupBy(g2 => g2.GetStringValue("TableName"));
                            foreach (var g2 in groupby2)
                            {
                                this.SetDeleteFieldDataSql(entityId, g2.ToList(), g2.Key, deleteDataSqlList);
                            }
                            break;
                        }
                    case "guid": { this.SetDeleteFieldDataSql(entityId, g.ToList(), "t_d_GuidDataTable", deleteDataSqlList); break; }
                    case "int":
                    case "long": { this.SetDeleteFieldDataSql(entityId, g.ToList(), "t_d_IntDataTable", deleteDataSqlList); break; }
                    case "float":
                    case "money": { this.SetDeleteFieldDataSql(entityId, g.ToList(), "t_d_FloatDataTable", deleteDataSqlList); break; }
                    case "date": { this.SetDeleteFieldDataSql(entityId, g.ToList(), "t_d_DateDataTable", deleteDataSqlList); break; }
                }
            }

            return deleteDataSqlList;
        }

        private void SetDeleteFieldDataSql(Guid primaryKey, List<IEntityData> propertyList, string tableName, List<string> deleteDataSqlList)
        {
            List<string> updateFieldList = new List<string>();
          
            propertyList.ForEach(p =>
            {
                updateFieldList.Add(string.Format("{0}=null", p.GetStringValue("FieldName")));
            });

            string sql = string.Format("update {0} set {1}", tableName, string.Join(",", updateFieldList));
            deleteDataSqlList.Add(string.Format("{0} where EntityId={1}", sql, primaryKey));
        }

        private void SetUpdatePropertyList(List<IEntityData> propertyList)
        {
            string fieldName = string.Empty, dataType = string.Empty;
            int fieldIndex = 0, maxLength = 0, isIndex = 0;

            propertyList.ForEach(p =>
            {
                fieldName = p.GetStringValue("FieldName");
                if (fieldName.Contains("GuidValue"))
                {
                    dataType = "guid";
                    fieldIndex = int.Parse(fieldName.Replace("GuidValue", string.Empty));
                    if (fieldIndex <= 10) isIndex = 1;
                }
                else if (fieldName.Contains("IntValue"))
                {
                    dataType = "int";
                    fieldIndex = int.Parse(fieldName.Replace("IntValue", string.Empty));
                }
                else if (fieldName.Contains("LongValue"))
                {
                    dataType = "long";
                    fieldIndex = int.Parse(fieldName.Replace("LongValue", string.Empty));
                }
                else if (fieldName.Contains("FloatValue"))
                {
                    dataType = "float";
                    fieldIndex = int.Parse(fieldName.Replace("FloatValue", string.Empty));
                }
                else if (fieldName.Contains("MoneyValue"))
                {
                    dataType = "money";
                    fieldIndex = int.Parse(fieldName.Replace("MoneyValue", string.Empty));
                }
                else if (fieldName.Contains("DateValue"))
                {
                    dataType = "date";
                    fieldIndex = int.Parse(fieldName.Replace("DateValue", string.Empty));
                    if (fieldIndex <= 10) isIndex = 1;
                }
                else
                {
                    dataType = "string";
                    if (fieldName.Contains("NvarcharMaxValue"))
                    {
                        maxLength = 0;
                        fieldIndex = int.Parse(fieldName.Replace("NvarcharMaxValue", string.Empty));
                    }
                    else if (fieldName.Contains("Nvarchar50Value"))
                    {
                        maxLength = 50;
                        fieldIndex = int.Parse(fieldName.Replace("Nvarchar50Value", string.Empty));
                        if (fieldIndex <= 10) isIndex = 1;
                    }
                    else if (fieldName.Contains("Nvarchar500Value"))
                    {
                        maxLength = 590;
                        fieldIndex = int.Parse(fieldName.Replace("Nvarchar500Value", string.Empty));
                    }
                    else if (fieldName.Contains("Nvarchar2000Value"))
                    {
                        maxLength = 2000;
                        fieldIndex = int.Parse(fieldName.Replace("Nvarchar2000Value", string.Empty));
                    }
                    else if (fieldName.Contains("Nvarchar4000Value"))
                    {
                        maxLength = 4000;
                        fieldIndex = int.Parse(fieldName.Replace("Nvarchar4000Value", string.Empty));
                    }

                    p.SetValue("MaxLength", maxLength);
                }

                p.SetValue("DataType", dataType);
                p.SetValue("IsIndex", isIndex);
                p.SetValue("FieldIndex", fieldIndex);
            });
        }

        private List<IEntityData> GetDataPropertyList(Guid entityId)
        {
            IQuery query = new Query(this._dataPropertyEntityType.TableName);
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@EntityId", entityId));
            query.Where("where EntityId=@EntityId", parameterList);
            return this.SelectEntities(query);
        }
    }
}
