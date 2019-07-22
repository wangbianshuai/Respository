package OpenDataAccess.Entity;

import OpenDataAccess.LambdaInterface.IFunction2;
import OpenDataAccess.Utility.Common;

import java.util.ArrayList;
import java.util.List;

public class EntityType {
    public String Name;
    public String TableName;
    public String WithSql;
    public String PrimaryKey;
    public boolean IsGet;
    public boolean IsPost;
    public boolean IsPut;
    public boolean IsDelete;
    public List<String> NoSelectNameList;
    public LogAttribute LogAttribute;
    public List<Property> Properties;
    public List<IFunction2<IValidate, IEntityData, String>> InsertValidateList;
    public List<IFunction2<IValidate, IEntityData, String>> UpdateValidateList;
    public List<IFunction2<IValidate, IEntityData, String>> DeleteValidateList;

    public EntityType() {
        this.InsertValidateList = new ArrayList<>();
        this.UpdateValidateList = new ArrayList<>();
        this.DeleteValidateList = new ArrayList<>();
    }

    public static List<EntityType> EntityTypeList = new ArrayList<>();

    public static EntityType GetEntityType(String name, boolean blClone) {
        if (Common.IsNullOrEmpty(name)) return null;

        EntityType entityType = Common.GetFirstOrDefault(EntityType.class, EntityTypeList, where -> where.Name.toLowerCase().equals(name.toLowerCase()));
        if (entityType != null && blClone) {
            EntityType newEntityType = new EntityType();
            newEntityType.DeleteValidateList = entityType.DeleteValidateList;
            newEntityType.InsertValidateList = entityType.InsertValidateList;
            newEntityType.Name = entityType.Name;
            newEntityType.PrimaryKey = entityType.PrimaryKey;
            newEntityType.IsDelete = entityType.IsDelete;
            newEntityType.IsGet = entityType.IsGet;
            newEntityType.IsPost = entityType.IsPost;
            newEntityType.IsPut = entityType.IsPut;
            newEntityType.LogAttribute = entityType.LogAttribute;
            if (entityType.Properties != null) {
                List<Property> propertyList = new ArrayList<>();
                entityType.Properties.forEach(a -> {
                    Property p = new Property();
                    p.Name = a.Name;
                    p.ParameterName = a.ParameterName;
                    p.Type = a.Type;
                    p.IsSelect = a.IsSelect;
                    propertyList.add(p);
                });
                newEntityType.Properties = propertyList;
            }
            newEntityType.TableName = entityType.TableName;
            newEntityType.WithSql = entityType.WithSql;
            newEntityType.UpdateValidateList = entityType.UpdateValidateList;
            return newEntityType;
        }
        return entityType;
    }

    public static <T extends IEntity> EntityType GetEntityType(Class<T> cls) throws InstantiationException, IllegalAccessException {
        EntityType entityType = EntityType.GetEntityType(cls.getName(), false);
        if (entityType == null) {
            EntityType.SetEntityType(cls);
            entityType = EntityType.GetEntityType(cls.getName(), false);
        }
        return entityType;
    }

    public static <T extends IEntity> void SetEntityType(Class<T> cls) throws InstantiationException, IllegalAccessException {
        if (!Common.Exists(EntityTypeList, exists -> exists.Name.equals(cls.getName()))) {
            T entity = cls.newInstance();
            EntityTypeList.add(entity.ToEntityType());
        }
    }

    public static void SetEntityTypeByType(Class<?> type) throws InstantiationException, IllegalAccessException {
        if (!Common.Exists(EntityTypeList, exists -> exists.Name.equals(type.getName()))) {
            IEntity entity = (IEntity) type.newInstance();
            if (entity != null) EntityTypeList.add(entity.ToEntityType());
        }
    }

    public static void SetEntityTypeByObject(Object obj) {
        if (!Common.Exists(EntityTypeList, exists -> exists.Name.equals(obj.getClass().getName()))) {
            IEntity entity = (IEntity) obj;
            if (entity != null) EntityTypeList.add(entity.ToEntityType());
        }
    }

    public Property GetProperty(String name) {
        return Common.IsNullOrEmpty(name) ? null : Common.GetFirstOrDefault(Property.class, this.Properties, where -> where.Name.trim().toLowerCase().equals(name.trim().toLowerCase()));
    }

    public List<Property> GetPropertyList(List<String> propertyNameList) {
        List<Property> list = new ArrayList<>();

        this.Properties.forEach(p -> {
            if (Common.Exists(propertyNameList, where -> where.trim().toLowerCase().equals(p.Name.trim().toLowerCase()))) {
                list.add(p);
            }
        });

        return list;
    }
}
