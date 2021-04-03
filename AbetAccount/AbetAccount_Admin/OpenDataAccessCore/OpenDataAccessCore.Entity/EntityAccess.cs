using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using OpenDataAccessCore.Data;

namespace OpenDataAccessCore.Entity
{
    public abstract class EntityAccess : IEntityAccess
    {
        public IDataBase CurrentDataBase { get; set; }
        public EntityType EntityType { get; set; }

        public EntityAccess()
        {
            this.CurrentDataBase = Data.DataAccess.GetDataBase();
        }

        public EntityAccess(EntityType entityType)
        {
            this.CurrentDataBase = Data.DataAccess.GetDataBase();
            this.EntityType = entityType;
        }

        public List<IEntityData> SelectEntities(IQuery query)
        {
            IDataReader reader = this.CurrentDataBase.ExecSqlReader(query.ToSql(), query.ParameterList);
            List<Dictionary<string, object>> dictList = this.CurrentDataBase.DataReaderToDictionaryList(reader);
   
            EntityType entityType = EntityType.GetEntityType(query.EntityName);

            if (entityType == null)
            {
                return (from dict in dictList
                        select new EntityData(dict, query.EntityName) as IEntityData).ToList();
            }
            else
            {
                return (from dict in dictList
                        select new EntityData(dict, entityType) as IEntityData).ToList();
            }
        }

        public List<T> SelectEntities<T>(IQuery query) where T : class
        {
            IDataReader reader = this.CurrentDataBase.ExecSqlReader(query.ToSql(), query.ParameterList);
            List<Dictionary<string, object>> dictList = this.CurrentDataBase.DataReaderToDictionaryList(reader);

            return Parse.DictionaryListToList<T>(dictList);
        }

        public List<IEntityData> SelectEntities(string procName, List<IDbDataParameter> parameterList)
        {
            return this.SelectEntities(string.Empty, procName, parameterList);
        }

        public List<IEntityData> SelectEntities(string entityName, string procName, List<IDbDataParameter> parameterList)
        {
            IDataReader reader = this.CurrentDataBase.ExecProcReader(procName, parameterList);
            List<Dictionary<string, object>> dictList = this.CurrentDataBase.DataReaderToDictionaryList(reader);

            EntityType entityType = EntityType.GetEntityType(entityName);

            if (entityType == null)
            {
                return (from dict in dictList
                        select new EntityData(dict, entityName) as IEntityData).ToList();
            }
            else
            {
                return (from dict in dictList
                        select new EntityData(dict, entityType) as IEntityData).ToList();
            }
        }

        public IEntityData SelectEntity(IQuery query)
        { 
            return this.SelectEntities(query).FirstOrDefault();
        }

        public T SelectEntity<T>(IQuery query) where T : class
        {
            return this.SelectEntities<T>(query).FirstOrDefault();
        }

        public IEntityData SelectEntity(string procName, List<IDbDataParameter> parameterList)
        {
            return this.SelectEntity(string.Empty, procName, parameterList);
        }

        public IEntityData SelectEntity(string entityName, string procName, List<IDbDataParameter> parameterList)
        {
            return this.SelectEntities(entityName, procName, parameterList).FirstOrDefault();
        }

        public IEntityData SelectEntityByPrimaryKey(object primaryKey)
        {
            IQuery query = this.GetQueryByPrimaryKey(primaryKey);
            if (query != null)
            {
                return this.SelectEntity(query);
            }
            return null;
        }

        private IQuery GetQueryByPrimaryKey(object primaryKey)
        {
            IQuery query = new Query(this.EntityType.TableName);
            Property primaryKeyProperty = this.EntityType.GetProperty(this.EntityType.PrimaryKey);
            if (primaryKeyProperty != null)
            {
                primaryKeyProperty.Value = Common.ChangeType(primaryKey, primaryKeyProperty.Type);
                List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
                parameterList.Add(this.GetInParameter(primaryKeyProperty));
                List<WhereStatement> whereList = new List<WhereStatement>()
                {
                    new WhereStatement(primaryKeyProperty.Name,"=",primaryKeyProperty.ParameterName)
                };
                return query.Where(whereList, parameterList);
            }
            return null;
        }

        public bool InsertEntity(EntityType entityType, IEntityData entityData, out object primaryKey, IDbTransaction trans = null)
        {
            primaryKey = null;
            List<string> fieldList = new List<string>();
            List<string> valueList = new List<string>();
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            string propertyName = string.Empty;
            Property property = null;
            IDbDataParameter parameter = null;
            Property primaryKeyProeprty = entityType.GetProperty(entityType.PrimaryKey);
            if (primaryKeyProeprty != null && primaryKeyProeprty.Type == typeof(Guid) && entityData.GetValue<Guid>(primaryKeyProeprty.Name) == Guid.Empty)
            {
                entityData.SetValue(primaryKeyProeprty.Name, Guid.NewGuid());
            }

            if (this.CurrentDataBase is IOracleDataBase)
            {
                entityData.SetValue("RowVersion", Guid.NewGuid());
            }

            for (int i = 0; i < entityData.Count; i++)
            {
                propertyName = entityData.GetPropertyName(i);
                property = entityType.GetProperty(propertyName);
                if (property != null)
                {
                    property.Value = Common.ChangeType(entityData.GetValue(propertyName), property.Type);
                    if (property.Value != null)
                    {
                        fieldList.Add(propertyName);
                        parameterList.Add(this.GetInParameter(property));
                        valueList.Add(property.ParameterName);
                    }
                }
            }

            string identitySql = string.Empty;
            if (this.CurrentDataBase is ISqlDataBase && primaryKeyProeprty != null && (primaryKeyProeprty.Type == typeof(int) || primaryKeyProeprty.Type == typeof(long)))
            {

                if (this.CurrentDataBase.ClientType == ServerClient.MySqlClient)
                {
                    identitySql = string.Format("; select @@identity;", primaryKeyProeprty.Name);
                }
                else
                {
                    parameterList.Add(this.GetOutParameter(primaryKeyProeprty));
                    identitySql = string.Format(" set @{0} = @@identity", primaryKeyProeprty.Name);
                }
            }

            string sqlText = string.Concat("insert into ", entityType.TableName, " (", string.Join(",", fieldList.ToArray()), ") values (", string.Join(",", valueList.ToArray()), ")", identitySql);

            bool blSucceed = true;

            if (this.CurrentDataBase.ClientType == ServerClient.MySqlClient && primaryKeyProeprty != null && (primaryKeyProeprty.Type == typeof(int) || primaryKeyProeprty.Type == typeof(long)))
            {
                primaryKey = this.CurrentDataBase.ExecSqlScalar(sqlText, parameterList, trans);
                if (primaryKey != null)
                {
                    entityData.SetValue(primaryKeyProeprty.Name, primaryKey);
                    if ((ulong)primaryKey > 0)
                    {
                        blSucceed = true;
                    }
                }
            }
            else
            {
                blSucceed = this.CurrentDataBase.ExecSqlNonQuery(sqlText, parameterList, trans);

                if (blSucceed && primaryKeyProeprty != null)
                {
                    parameter = parameterList.Where(where => where.ParameterName == primaryKeyProeprty.ParameterName).FirstOrDefault();
                    if (parameter != null)
                    {
                        primaryKey = parameter.Value;
                        entityData.SetValue(primaryKeyProeprty.Name, primaryKey);
                    }
                }
            }

            return blSucceed;
        }

        public bool InsertEntity(IEntityData entityData, out object primaryKey, IDbTransaction trans = null)
        {
            return this.InsertEntity(this.EntityType, entityData, out primaryKey, trans);
        }

        public bool InsertEntity(IEntity entity, List<string> fieldList, out object primaryKey, IDbTransaction trans = null)
        {
            return this.InsertEntity(entity.ToEntityData(fieldList), out primaryKey, trans);
        }

        public bool InsertEntity(EntityType entityType, IEntity entity, List<string> fieldList, out object primaryKey, IDbTransaction trans = null)
        {
            return this.InsertEntity(entityType, entity.ToEntityData(fieldList), out primaryKey, trans);
        }

        public bool UpdateEntityByPrimaryKey(object primaryKey, IEntityData entityData,IDbTransaction trans = null)
        {
            IQuery query = this.GetQueryByPrimaryKey(primaryKey);
            if (query != null)
            {
                return this.UpdateEntity(query, entityData, trans);
            }
            return false;
        }

        public bool UpdateEntityByPrimaryKey(object primaryKey, IEntity entity, List<string> fieldList, IDbTransaction trans = null)
        {
            return this.UpdateEntityByPrimaryKey(primaryKey, entity.ToEntityData(fieldList), trans);
        }

        public bool UpdateEntity(EntityType entityType, IQuery query, IEntityData entityData, IDbTransaction trans = null)
        {
            List<string> fieldValueList = new List<string>();
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            string propertyName = string.Empty;
            Property property = null;

            if (this.CurrentDataBase is IOracleDataBase)
            {
                entityData.SetValue("RowVersion", Guid.NewGuid());
            }
            else
            {
                entityData.Remove("RowVersion");
            }

            for (int i = 0; i < entityData.Count; i++)
            {
                propertyName = entityData.GetPropertyName(i);
                property = entityType.GetProperty(propertyName);
                if (property != null && property.Name != entityType.PrimaryKey)
                {
                    property.Value = Data.Common.ChangeType(entityData.GetValue(propertyName), property.Type);
                    parameterList.Add(this.GetInParameter(property));
                    fieldValueList.Add(string.Concat(property.Name, "=", property.ParameterName));
                }
            }
            string sqlText = string.Concat("update ", entityType.TableName, " set ", string.Join(",", fieldValueList.ToArray()), query.ToWhereSql());
            if (query.ParameterList != null)
            {
                parameterList.AddRange((from queryParameter in query.ParameterList
                                        where !parameterList.Exists(p => p.ParameterName == queryParameter.ParameterName)
                                        select queryParameter));
            }
            return this.CurrentDataBase.ExecSqlNonQuery(sqlText, parameterList, trans);
        }

        public bool UpdateEntity(IQuery query, IEntityData entityData, IDbTransaction trans = null)
        {
            return this.UpdateEntity(this.EntityType, query, entityData, trans);
        }

        public bool UpdateEntity(IQuery query, IEntity entity, List<string> fieldList, IDbTransaction trans = null)
        {
            return this.UpdateEntity(query, entity.ToEntityData(fieldList), trans);
        }

        public bool DeleteEntityByPrimaryKey(object primaryKey, IDbTransaction trans = null)
        {
            IQuery query = this.GetQueryByPrimaryKey(primaryKey);
            if (query != null)
            {
                return this.DeleteEntity(query, trans);
            }
            return false;
        }

        public bool DeleteEntity(IQuery query, IDbTransaction trans = null)
        {
            return this.DeleteEntity(this.EntityType, query, trans);
        }

        public bool DeleteEntity(EntityType entityType, IQuery query, IDbTransaction trans = null)
        {
            string sqlText = string.Concat("delete from ", entityType.TableName, query.ToWhereSql());
            return this.CurrentDataBase.ExecSqlNonQuery(sqlText, query.ParameterList, trans);
        }

        public IDbDataParameter GetInParameter(Property property)
        {
            return this.GetParameter(property, ParameterDirection.Input);
        }

        private IDbDataParameter GetParameter(Property property, ParameterDirection type)
        {
            property.ParameterName = string.IsNullOrEmpty(property.ParameterName) ? "@" + property.Name : property.ParameterName;
            if (type == ParameterDirection.Input)
            {
                if (property.Value == null)
                {
                    return this.CurrentDataBase.InParameter(property.ParameterName, DBNull.Value);
                }
                else
                {
                    return this.CurrentDataBase.InParameter(property.ParameterName, property.Value);
                }
            }
            else if (type == ParameterDirection.Output)
            {
                return this.CurrentDataBase.OutParameter(property.ParameterName);
            }
            else if (type == ParameterDirection.InputOutput)
            {
                if (property.Value == null)
                {
                    return this.CurrentDataBase.InOutParameter(property.ParameterName, DBNull.Value);
                }
                else
                {
                    return this.CurrentDataBase.InOutParameter(property.ParameterName, property.Value);
                }
            }
            else
            {
                return null;
            }
        }

        public IDbDataParameter GetOutParameter(Property property)
        {
            return this.GetParameter(property, ParameterDirection.Output);
        }

        public IDbDataParameter GetInOutParameter(Property property)
        {
            return this.GetParameter(property, ParameterDirection.InputOutput);
        }

        public IDbDataParameter InParameter(string name, object value)
        {
            return this.CurrentDataBase.InParameter(name, value);
        }
    }
}
