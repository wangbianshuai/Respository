package OpenDataAccess.Entity;

import OpenDataAccess.LambdaInterface.IFunction2;
import OpenDataAccess.Utility.Common;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class EntityModel implements IEntity {
    public EntityType ToEntityType() {
        EntityType entityType = null;
        String name = this.getClass().getName();
        entityType = EntityType.GetEntityType(name, false);
        if (entityType != null) {
            return entityType;
        }
        entityType = new EntityType();
        entityType.Name = name;
        entityType.Properties = new ArrayList<>();

        TablePropertyAttribute tableProperty = this.getClass().getAnnotation(TablePropertyAttribute.class);
        if (tableProperty != null) {
            entityType.TableName = tableProperty.Name;
            entityType.WithSql = tableProperty.WithSql;
            entityType.PrimaryKey = tableProperty.PrimaryKey;
            entityType.NoSelectNameList = Common.StringIsNullOrEmpty(tableProperty.NoSelectNames) ? new ArrayList<>() : Arrays.asList(tableProperty.NoSelectNames.split(","));
        }

        RequestMethodAttribute requestMethodProperty = this.getClass().getAnnotation(RequestMethodAttribute.class);
        if (requestMethodProperty != null) {
            entityType.IsDelete = requestMethodProperty.IsDelete;
            entityType.IsGet = requestMethodProperty.IsGet;
            entityType.IsPost = requestMethodProperty.IsPost;
            entityType.IsPut = requestMethodProperty.IsPut;
        } else {
            entityType.IsDelete = true;
            entityType.IsGet = true;
            entityType.IsPost = true;
            entityType.IsPut = true;
        }

        LogAttribute logAttribute = this.getClass().getAnnotation(LogAttribute.class);
        if (logAttribute != null) entityType.LogAttribute = logAttribute;

        Field[] fileds = this.getClass().getFields();
        Property p = null;
        Field f = null;
        for (int i = 0; i < fileds.length; i++) {
            p = new Property();
            f = fileds[i];
            p.Name = f.getName();
            p.Type = f.getType();
            p.IsSelect = !entityType.NoSelectNameList.contains(p.Name);

            entityType.Properties.add(p);
        }
        this.InsertValidate(entityType.InsertValidateList);
        this.UpdateValidate(entityType.UpdateValidateList);
        this.DeleteValidate(entityType.DeleteValidateList);
        return entityType;
    }

    public IEntityData ToEntityData() throws IllegalAccessException {
        IEntityData entityData = new EntityData(this.ToEntityType());

        Field[] fileds = this.getClass().getFields();
        Object value = null;
        Field f = null;
        for (int i = 0; i < fileds.length; i++) {
            f = fileds[i];
            value = f.get(this);
            if (value != null) entityData.SetValue(f.getName(), value);
        }
        return entityData;
    }

    public IEntityData ToEntityData(List<String> fieldList) throws IllegalAccessException {
        IEntityData entityData = new EntityData(this.ToEntityType());

        Field[] fileds = this.getClass().getFields();
        Object value = null;
        Field f = null;
        for (int i = 0; i < fileds.length; i++) {
            f = fileds[i];
            String name = f.getName();
            value = f.get(this);
            if (value != null && Common.Exists(fieldList, e -> e.toLowerCase().equals(name.toLowerCase()))) {
                entityData.SetValue(name, value);
            }
        }
        return entityData;
    }

    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
    }

    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
    }

    public void DeleteValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
    }

    public <T extends IEntity> IFunction2<IValidate, IEntityData, String> InsertValidateUnique(String propertyName, String message) {
        return (valiate, entityData) ->
        {
            return valiate.InsertValidateUnique(entityData, propertyName, message);
        };
    }

    public <T extends IEntity> IFunction2<IValidate, IEntityData, String> UpdateValidateUnique(String propertyName, String message) {
        return (valiate, entityData) ->
        {
            return valiate.UpdateValidateUnique(entityData, propertyName, message);
        };
    }

    public <T extends IEntity> IFunction2<IValidate, IEntityData, String> ValidateExists(String filter, String message, boolean blExists) {
        return (valiate, entityData) ->
        {
            return valiate.ValidateExists(entityData, filter, message, blExists);
        };
    }
}