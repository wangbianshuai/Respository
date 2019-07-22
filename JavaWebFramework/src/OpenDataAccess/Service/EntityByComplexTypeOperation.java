package OpenDataAccess.Service;

import OpenDataAccess.Data.*;
import OpenDataAccess.Entity.EntityData;
import OpenDataAccess.Entity.EntityType;
import OpenDataAccess.Entity.IEntityData;
import OpenDataAccess.Entity.Property;
import OpenDataAccess.LambdaInterface.IFunction3;
import OpenDataAccess.Utility.Common;

import java.util.List;
import java.util.Map;

public class EntityByComplexTypeOperation {
    public static <T extends IEntityRequest> boolean Insert(T entityRequest, IEntityData entityData, EntityType complexTypeEntity, String complexTypePropertyName, IFunction3<IDataTransaction, IEntityData, Property, Boolean> insertChildComplexType) {
        IDataTransaction trans = null;
        boolean blSucceed = Insert(entityRequest, trans, entityData, complexTypeEntity, complexTypePropertyName, insertChildComplexType);
        return entityRequest.GetDataBase().CommitTransaction(trans, blSucceed);
    }

    public static <T extends IEntityRequest> boolean Insert(T entityRequest, IDataTransaction trans, IEntityData entityData, EntityType complexTypeEntity, String complexTypePropertyName, IFunction3<IDataTransaction, IEntityData, Property, Boolean> insertChildComplexType) {
        try {
            boolean blSucceed = true;
            Object primaryKey = null;

            primaryKey = entityRequest.InsertEntity(entityData, trans);
            blSucceed = primaryKey != null;
            Property primaryKeyProperty = entityRequest.GetEntityType().GetProperty(entityRequest.GetEntityType().PrimaryKey);
            primaryKeyProperty.Value = primaryKey;
            blSucceed = InsertComplexType(entityRequest, trans, entityData, primaryKeyProperty, complexTypeEntity, complexTypePropertyName, insertChildComplexType);
            return blSucceed;
        } catch (Exception ex) {
            return false;
        }
    }

    public static <T extends IEntityRequest> Object Insert(T entityRequest, EntityType complexTypeEntity, String complexTypePropertyName, IFunction3<IDataTransaction, IEntityData, Property, Boolean> insertChildComplexType) {
        try {
            IDataTransaction trans = null;
            boolean blSucceed = true;
            Object primaryKey = null;
            if (entityRequest.GetRequest().Entities.containsKey(entityRequest.GetEntityType().Name)) {
                IEntityData entityData = entityRequest.GetRequest().Entities.get(entityRequest.GetEntityType().Name).get(0);
                String message = entityRequest.Validate(entityData, entityRequest.GetEntityType().InsertValidateList);
                if (!Common.IsNullOrEmpty(message)) {
                    return entityRequest.GetMessageDict(message);
                }
                primaryKey = entityRequest.InsertEntity(entityData, trans);
                blSucceed = primaryKey != null;
                Property primaryKeyProperty = entityRequest.GetEntityType().GetProperty(entityRequest.GetEntityType().PrimaryKey);
                primaryKeyProperty.Value = primaryKey;
                blSucceed = InsertComplexType(entityRequest, trans, entityData, primaryKeyProperty, complexTypeEntity, complexTypePropertyName, insertChildComplexType);
                blSucceed = entityRequest.GetDataBase().CommitTransaction(trans, blSucceed);
                Map<String, Object> booleanDict = entityRequest.GetBoolDict(blSucceed);
                booleanDict.put("PrimaryKey", primaryKey);
                return booleanDict;
            } else {
                return entityRequest.GetBoolDict(false);
            }
        } catch (Exception ex) {
            return entityRequest.GetExceptionDict(ex.getMessage());
        }
    }

    public static <T extends IEntityRequest> boolean InsertComplexType(T entityRequest, IDataTransaction trans, IEntityData entityData, Property primaryKeyProperty, EntityType complexTypeEntity, String complexTypePropertyName, IFunction3<IDataTransaction, IEntityData, Property, Boolean> insertChildComplexType) {
        boolean blSucceed = true;
        List<Map<String, Object>> complexTypeDataList = (List<Map<String, Object>>) entityData.GetValue(complexTypePropertyName);
        if (complexTypeDataList != null && complexTypeDataList.size() > 0) {
            IEntityData complexTypeEntityData = null;
            Object complexTypePrimaryKey = null;
            for (int i = 0; i < complexTypeDataList.size(); i++) {
                Map<String, Object> dict = complexTypeDataList.get(i);
                complexTypeEntityData = new EntityData(dict, complexTypeEntity);
                complexTypeEntityData.SetValue(primaryKeyProperty.Name, primaryKeyProperty.Value);
                complexTypePrimaryKey = entityRequest.InsertEntity(complexTypeEntity, complexTypeEntityData, trans);
                blSucceed = complexTypePrimaryKey != null;
                if (!blSucceed) {
                    break;
                }
                if (insertChildComplexType != null) {
                    Property complexTypePrimaryKeyProperty = complexTypeEntity.GetProperty(complexTypeEntity.PrimaryKey);
                    complexTypePrimaryKeyProperty.Value = complexTypePrimaryKey;
                    blSucceed = insertChildComplexType.Invoke(trans, complexTypeEntityData, complexTypePrimaryKeyProperty);
                }
            }
        }
        return blSucceed;
    }

    public static <T extends IEntityRequest> boolean Update(T entityRequest, IEntityData entityData, Object primaryKey, EntityType complexTypeEntity, String complexTypePropertyName) {
        try {
            IDataTransaction trans = null;
            boolean blSucceed = true;
            if (entityRequest.GetRequest().Entities.containsKey(entityRequest.GetEntityType().Name)) {
                blSucceed = entityRequest.UpdateEntityByPrimaryKey(primaryKey, entityData, trans);
                if (blSucceed) {
                    DeleteComplexType(entityRequest, trans, entityRequest.GetQueryRequest().PrimaryKeyProperty, complexTypeEntity);
                    blSucceed = InsertComplexType(entityRequest, trans, entityData, entityRequest.GetQueryRequest().PrimaryKeyProperty, complexTypeEntity, complexTypePropertyName, null);
                }
                return entityRequest.GetDataBase().CommitTransaction(trans, blSucceed);
            } else {
                return false;
            }
        } catch (Exception ex) {
            return false;
        }
    }

    public static <T extends IEntityRequest> Object Update(T entityRequest, EntityType complexTypeEntity, String complexTypePropertyName, IFunction3<IDataTransaction, IEntityData, Property, Boolean> insertChildComplexType) {
        try {
            IDataTransaction trans = null;
            boolean blSucceed = true;
            if (entityRequest.GetRequest().Entities.containsKey(entityRequest.GetEntityType().Name)) {
                IEntityData entityData = entityRequest.GetRequest().Entities.get(entityRequest.GetEntityType().Name).get(0);
                String message = entityRequest.Validate(entityData, entityRequest.GetEntityType().UpdateValidateList);
                if (!Common.IsNullOrEmpty(message)) {
                    return entityRequest.GetMessageDict(message);
                }
                if (entityData.GetValue("RowVersion") != null) {
                    IEntityData oldEntityData = entityRequest.SelectEntity(entityRequest.GetQueryRequest().ToQuery());
                    if (oldEntityData == null) {
                        return entityRequest.GetBoolDict(false);
                    }
                    message = entityRequest.CompareVersion(entityData, oldEntityData);
                    if (!Common.IsNullOrEmpty(message)) {
                        return entityRequest.GetMessageDict(message);
                    }
                }
                blSucceed = entityRequest.UpdateEntity(entityRequest.GetQueryRequest().ToQuery(), entityData, trans);
                if (blSucceed) {
                    DeleteComplexType(entityRequest, trans, entityRequest.GetQueryRequest().PrimaryKeyProperty, complexTypeEntity);
                    blSucceed = InsertComplexType(entityRequest, trans, entityData, entityRequest.GetQueryRequest().PrimaryKeyProperty, complexTypeEntity, complexTypePropertyName, insertChildComplexType);
                }
                blSucceed = entityRequest.GetDataBase().CommitTransaction(trans, blSucceed);
                return entityRequest.GetBoolDict(blSucceed);
            } else {
                return entityRequest.GetBoolDict(false);
            }
        } catch (Exception ex) {
            return entityRequest.GetExceptionDict(ex.getMessage());
        }
    }

    public static <T extends IEntityRequest> boolean DeleteComplexType(T entityRequest, IDataTransaction trans, Property primaryKeyProperty, EntityType complexTypeEntity) {
        IQuery query = new Query(complexTypeEntity.TableName, complexTypeEntity.Name);
        IDataParameterList parameterList = new DataParameterList();
        parameterList.Set(primaryKeyProperty.Name, primaryKeyProperty.Value);
        query.Where(String.format(" where %=@%", primaryKeyProperty.Name, primaryKeyProperty.Name), parameterList);
        return entityRequest.DeleteEntity(complexTypeEntity, query, trans);
    }

    public static <T extends IEntityRequest> Object Delete(T entityRequest, EntityType complexTypeEntity) {
        try {
            IDataTransaction trans = null;
            boolean blSucceed = true;
            String rowVersion = entityRequest.GetRequest().GetParameterValue("RowVersion");
            if (!Common.IsNullOrEmpty(rowVersion)) {
                IEntityData entityData = new EntityData(entityRequest.GetEntityType());
                entityData.SetValue("RowVersion", rowVersion);
                IEntityData oldEntityData = entityRequest.SelectEntity(entityRequest.GetQueryRequest().ToQuery());
                if (oldEntityData == null) {
                    return entityRequest.GetBoolDict(false);
                }
                String message = entityRequest.CompareVersion(entityData, oldEntityData);
                if (!Common.IsNullOrEmpty(message)) {
                    return entityRequest.GetMessageDict(message);
                }
            }
            blSucceed = entityRequest.DeleteEntity(entityRequest.GetQueryRequest().ToQuery(), trans);
            if (blSucceed) {
                DeleteComplexType(entityRequest, trans, entityRequest.GetQueryRequest().PrimaryKeyProperty, complexTypeEntity);
            }
            blSucceed = entityRequest.GetDataBase().CommitTransaction(trans, blSucceed);
            return entityRequest.GetBoolDict(blSucceed);
        } catch (Exception ex) {
            return entityRequest.GetExceptionDict(ex.getMessage());
        }
    }

    public static <T extends IEntityRequest> Object GetEntityData(T entityRequest, EntityType complexTypeEntity, String complexTypePropertyName) {
        IEntityData entityData = (IEntityData) entityRequest.Select();
        if (entityData != null) {
            IQuery query = new Query(complexTypeEntity.TableName, complexTypeEntity.Name);
            IDataParameterList parameterList = new DataParameterList();
            Property property = entityRequest.GetQueryRequest().PrimaryKeyProperty;
            parameterList.Set(property.Name, property.Value);
            query.Where(String.format(" where %=@%", entityRequest.GetEntityType().PrimaryKey, entityRequest.GetEntityType().PrimaryKey), parameterList);
            List<IEntityData> complexDataList = entityRequest.SelectEntities(query);
            entityData.SetValue(complexTypePropertyName, complexDataList);
        }
        return entityData;
    }
}