using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using OpenDataAccess.Data;
using OpenDataAccess.Entity;

namespace OpenDataAccess.Service
{
    public class EntityByComplexTypeOperation
    {
        public static bool Insert<T>(T entityRequest, IEntityData entityData, EntityType complexTypeEntity, string complexTypePropertyName, Func<IDbTransaction, IEntityData, Property, bool> insertChildComplexType = null) where T : IEntityRequest
        {
            IDbTransaction trans = entityRequest.CurrentDataBase.BeginTransaction(entityRequest.CurrentDataBase.ConnectionString);
            bool blSucceed = Insert<T>(entityRequest, trans, entityData, complexTypeEntity, complexTypePropertyName, insertChildComplexType);
            return entityRequest.CurrentDataBase.CommitTransaction(trans, blSucceed);
        }

        public static bool Insert<T>(T entityRequest, IDbTransaction trans, IEntityData entityData, EntityType complexTypeEntity, string complexTypePropertyName, Func<IDbTransaction, IEntityData, Property, bool> insertChildComplexType = null) where T : IEntityRequest
        {
            try
            {
                bool blSucceed = true;
                object primaryKey = null;

                blSucceed = entityRequest.InsertEntity(entityData, out primaryKey, trans);
                Property primaryKeyProperty = entityRequest.EntityType.GetProperty(entityRequest.EntityType.PrimaryKey);
                primaryKeyProperty.Value = primaryKey;
                blSucceed = InsertComplexType<T>(entityRequest, trans, entityData, primaryKeyProperty, complexTypeEntity, complexTypePropertyName, insertChildComplexType);
                return blSucceed;
            }
            catch
            {
                return false;
            }
        }

        public static object Insert<T>(T entityRequest, EntityType complexTypeEntity, string complexTypePropertyName, Func<IDbTransaction, IEntityData, Property, bool> insertChildComplexType = null) where T : IEntityRequest
        {
            try
            {
                IDbTransaction trans = entityRequest.CurrentDataBase.BeginTransaction(entityRequest.CurrentDataBase.ConnectionString);
                bool blSucceed = true;
                object primaryKey = null;
                if (entityRequest._Request.Entities.ContainsKey(entityRequest.EntityType.Name))
                {
                    IEntityData entityData = entityRequest._Request.Entities[entityRequest.EntityType.Name].FirstOrDefault();
                    string message = entityRequest.Validate(entityData, entityRequest.EntityType.InsertValidateList);
                    if (!string.IsNullOrEmpty(message))
                    {
                        return entityRequest.GetMessageDict(message);
                    }
                    blSucceed = entityRequest.InsertEntity(entityData, out primaryKey, trans);
                    Property primaryKeyProperty = entityRequest.EntityType.GetProperty(entityRequest.EntityType.PrimaryKey);
                    primaryKeyProperty.Value = primaryKey;
                    blSucceed = InsertComplexType<T>(entityRequest, trans, entityData, primaryKeyProperty, complexTypeEntity, complexTypePropertyName, insertChildComplexType);
                    blSucceed = entityRequest.CurrentDataBase.CommitTransaction(trans, blSucceed);
                    Dictionary<string, object> boolDict = entityRequest.GetBoolDict(blSucceed);
                    boolDict.Add("PrimaryKey", primaryKey);
                    return boolDict;
                }
                else
                {
                    return entityRequest.GetBoolDict(false);
                }
            }
            catch (Exception ex)
            {
                return entityRequest.GetExceptionDict(ex.Message);
            }
        }

        public static bool InsertComplexType<T>(T entityRequest, IDbTransaction trans, IEntityData entityData, Property primaryKeyProperty, EntityType complexTypeEntity, string complexTypePropertyName, Func<IDbTransaction, IEntityData, Property, bool> insertChildComplexType = null) where T : IEntityRequest
        {
            bool blSucceed = true;
            List<Dictionary<string, object>> complexTypeDataList = entityData.GetValue(complexTypePropertyName) as List<Dictionary<string, object>>;
            if (complexTypeDataList != null && complexTypeDataList.Count > 0)
            {
                IEntityData complexTypeEntityData = null;
                object complexTypePrimaryKey = null;
                foreach (Dictionary<string, object> dict in complexTypeDataList)
                {
                    complexTypeEntityData = new EntityData(dict, complexTypeEntity);
                    complexTypeEntityData.SetValue(primaryKeyProperty.Name, primaryKeyProperty.Value);
                    blSucceed = entityRequest.InsertEntity(complexTypeEntity, complexTypeEntityData, out complexTypePrimaryKey, trans);
                    if (!blSucceed)
                    {
                        break;
                    }
                    if (insertChildComplexType != null)
                    {
                        Property complexTypePrimaryKeyProperty = complexTypeEntity.GetProperty(complexTypeEntity.PrimaryKey);
                        complexTypePrimaryKeyProperty.Value = complexTypePrimaryKey;
                        blSucceed = insertChildComplexType(trans, complexTypeEntityData, complexTypePrimaryKeyProperty);
                    }
                }
            }
            return blSucceed;
        }

        public static bool Update<T>(T entityRequest, IEntityData entityData, object primaryKey, EntityType complexTypeEntity, string complexTypePropertyName) where T : IEntityRequest
        {
            try
            {
                IDbTransaction trans = entityRequest.CurrentDataBase.BeginTransaction(entityRequest.CurrentDataBase.ConnectionString);
                bool blSucceed = true;
                if (entityRequest._Request.Entities.ContainsKey(entityRequest.EntityType.Name))
                {
                    blSucceed = entityRequest.UpdateEntityByPrimaryKey(primaryKey, entityData, trans);
                    if (blSucceed)
                    {
                        DeleteComplexType<T>(entityRequest, trans, entityRequest._QueryRequest.PrimaryKeyProperty, complexTypeEntity);
                        blSucceed = InsertComplexType<T>(entityRequest, trans, entityData, entityRequest._QueryRequest.PrimaryKeyProperty, complexTypeEntity, complexTypePropertyName);
                    }
                    return entityRequest.CurrentDataBase.CommitTransaction(trans, blSucceed);
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        public static object Update<T>(T entityRequest, EntityType complexTypeEntity, string complexTypePropertyName, Func<IDbTransaction, IEntityData, Property, bool> insertChildComplexType = null) where T : IEntityRequest
        {
            try
            {
                IDbTransaction trans = entityRequest.CurrentDataBase.BeginTransaction(entityRequest.CurrentDataBase.ConnectionString);
                bool blSucceed = true;
                if (entityRequest._Request.Entities.ContainsKey(entityRequest.EntityType.Name))
                {
                    IEntityData entityData = entityRequest._Request.Entities[entityRequest.EntityType.Name].FirstOrDefault();
                    string message = entityRequest.Validate(entityData, entityRequest.EntityType.UpdateValidateList);
                    if (!string.IsNullOrEmpty(message))
                    {
                        return entityRequest.GetMessageDict(message);
                    }
                    if (entityData.GetValue("RowVersion") != null)
                    {
                        IEntityData oldEntityData = entityRequest.SelectEntity(entityRequest._QueryRequest.ToQuery());
                        if (oldEntityData == null)
                        {
                            return entityRequest.GetBoolDict(false);
                        }
                        message = entityRequest.CompareVersion(entityData, oldEntityData);
                        if (!string.IsNullOrEmpty(message))
                        {
                            return entityRequest.GetMessageDict(message);
                        }
                    }
                    blSucceed = entityRequest.UpdateEntity(entityRequest._QueryRequest.ToQuery(), entityData, trans);
                    if (blSucceed)
                    {
                        DeleteComplexType<T>(entityRequest, trans, entityRequest._QueryRequest.PrimaryKeyProperty, complexTypeEntity);
                        blSucceed = InsertComplexType<T>(entityRequest, trans, entityData, entityRequest._QueryRequest.PrimaryKeyProperty, complexTypeEntity, complexTypePropertyName, insertChildComplexType);
                    }
                    blSucceed = entityRequest.CurrentDataBase.CommitTransaction(trans, blSucceed);
                    return entityRequest.GetBoolDict(blSucceed);
                }
                else
                {
                    return entityRequest.GetBoolDict(false);
                }
            }
            catch (Exception ex)
            {
                return entityRequest.GetExceptionDict(ex.Message);
            }
        }

        public static bool DeleteComplexType<T>(T entityRequest, IDbTransaction trans, Property primaryKeyProperty, EntityType complexTypeEntity) where T : IEntityRequest
        {
            IQuery query = new Query(complexTypeEntity.TableName, complexTypeEntity.Name);
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>()
            {
                entityRequest.GetInParameter(primaryKeyProperty)
            };
            query.Where(string.Format(" where {0}=@{0}", primaryKeyProperty.Name), parameterList);
            return entityRequest.DeleteEntity(complexTypeEntity, query, trans);
        }

        public static object Delete<T>(T entityRequest, EntityType complexTypeEntity) where T : IEntityRequest
        {
            try
            {
                IDbTransaction trans = entityRequest.CurrentDataBase.BeginTransaction(entityRequest.CurrentDataBase.ConnectionString);
                bool blSucceed = true;
                string rowVersion = entityRequest._QueryRequest.GetParameterValue("RowVersion");
                if (!string.IsNullOrEmpty(rowVersion))
                {
                    IEntityData entityData = new EntityData(entityRequest.EntityType);
                    entityData.SetValue("RowVersion", rowVersion);
                    IEntityData oldEntityData = entityRequest.SelectEntity(entityRequest._QueryRequest.ToQuery());
                    if (oldEntityData == null)
                    {
                        return entityRequest.GetBoolDict(false);
                    }
                    string message = entityRequest.CompareVersion(entityData, oldEntityData);
                    if (!string.IsNullOrEmpty(message))
                    {
                        return entityRequest.GetMessageDict(message);
                    }
                }
                blSucceed = entityRequest.DeleteEntity(entityRequest._QueryRequest.ToQuery(), trans);
                if (blSucceed)
                {
                    DeleteComplexType<T>(entityRequest, trans, entityRequest._QueryRequest.PrimaryKeyProperty, complexTypeEntity);
                }
                blSucceed = entityRequest.CurrentDataBase.CommitTransaction(trans, blSucceed);
                return entityRequest.GetBoolDict(blSucceed);
            }
            catch (Exception ex)
            {
                return entityRequest.GetExceptionDict(ex.Message);
            }
        }

        public static object GetEntityData<T>(T entityRequest, EntityType complexTypeEntity, string complexTypePropertyName) where T : IEntityRequest
        {
            IEntityData entityData = entityRequest.Select() as IEntityData;
            if (entityData != null)
            {
                IQuery query = new Query(complexTypeEntity.TableName, complexTypeEntity.Name);
                List<IDbDataParameter> parameterList = new List<IDbDataParameter>()
                {
                    entityRequest.GetInParameter(entityRequest._QueryRequest.PrimaryKeyProperty)
                };
                query.Where(string.Format(" where {0}=@{0}", entityRequest.EntityType.PrimaryKey), parameterList);
                List<IEntityData> complexDataList = entityRequest.SelectEntities(query);
                entityData.SetValue(complexTypePropertyName, complexDataList);
            }
            return entityData;
        }
    }
}
