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
        String name = this.getClass().getSimpleName();
        entityType = EntityType.GetEntityType(name, false);
        if (entityType != null) {
            return entityType;
        }
        entityType = new EntityType();
        entityType.Name = name;
        entityType.IsClass = true;
        entityType.Properties = new ArrayList<>();

        ITablePropertyAttribute tableProperty = this.getClass().getAnnotation(ITablePropertyAttribute.class);
        if (tableProperty != null) {
            entityType.TableName = tableProperty.Name();
            entityType.WithSql = tableProperty.WithSql();
            entityType.PrimaryKey = tableProperty.PrimaryKey();
            entityType.NoSelectNameList = Common.IsNullOrEmpty(tableProperty.NoSelectNames()) ? new ArrayList<>() : Arrays.asList(tableProperty.NoSelectNames().split(","));
        }

        IRequestMethodAttribute requestMethodProperty = this.getClass().getAnnotation(IRequestMethodAttribute.class);
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

        entityType.LogAttribute = new LogAttribute();
        ILogAttribute logAttribute = this.getClass().getAnnotation(ILogAttribute.class);
        if (logAttribute != null) {
            entityType.LogAttribute.IsDelete = logAttribute.IsDelete();
            entityType.LogAttribute.IsGet = logAttribute.IsGet();
            entityType.LogAttribute.IsPost = logAttribute.IsPost();
            entityType.LogAttribute.IsPostQuery = logAttribute.IsPostQuery();
            entityType.LogAttribute.IsPut = logAttribute.IsPut();
        }


        Field[] fileds = this.getClass().getFields();
        Property p = null;
        Field f = null;
        for (int i = 0; i < fileds.length; i++) {
            p = new Property();
            f = fileds[i];
            p.Name = f.getName();
            p.Type = f.getType();
            p.ParameterName = "@" + p.Name;
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

    public <T extends IEntity> IFunction2<IValidate, IEntityData, String> InsertValidateUnique(Class<T> cls,String propertyName, String message) {
        return (valiate, entityData) ->
        {
            return valiate.InsertValidateUnique(cls, entityData, propertyName, message);
        };
    }

    public <T extends IEntity> IFunction2<IValidate, IEntityData, String> UpdateValidateUnique(Class<T> cls,String propertyName, String message) {
        return (valiate, entityData) ->
        {
            return valiate.UpdateValidateUnique(cls, entityData, propertyName, message);
        };
    }

    public <T extends IEntity> IFunction2<IValidate, IEntityData, String> ValidateExists(Class<T> cls, String filter, String message, boolean blExists) {
        return (valiate, entityData) ->
        {
            return valiate.ValidateExists(cls, entityData, filter, message, blExists);
        };
    }
}