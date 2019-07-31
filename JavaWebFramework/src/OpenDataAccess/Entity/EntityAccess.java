package OpenDataAccess.Entity;

import OpenDataAccess.Data.*;
import OpenDataAccess.LambdaInterface.IExceptionHandle;

import java.util.*;
import java.util.stream.Collectors;

public abstract class EntityAccess implements IEntityAccess {
    public IDataBase GetDataBase() {
        return _DataBase;
    }

    public void SetDataBase(IDataBase value) {
        _DataBase = value;
    }

    public EntityType GetEntityType() {
        return _EntityType;
    }

    public void SetEntityType(EntityType value) {
        _EntityType = value;
    }

    private IDataBase _DataBase = null;
    private EntityType _EntityType = null;

    public IExceptionHandle ExceptionHandle = null;

    public EntityAccess() {
        this.Init();
    }

    private void Init() {
        this._DataBase = DataAccess.GetDataBase();
    }

    public EntityAccess(EntityType entityType, IExceptionHandle exHandle) {
        Init();
        _EntityType = entityType;
        this.ExceptionHandle = exHandle;
    }

    private void ExHandling(Exception ex) {
        if (this.ExceptionHandle != null) {
            this.ExceptionHandle.Handling(ex);
        }
    }

    public <T> List<T> SelectEntities(Class<T> cls, String sql, IDataParameterList parameterList) {
        try {
            return this._DataBase.ExceSelectTo(cls, sql, parameterList);
        } catch (Exception ex) {
            this.ExHandling(ex);
            return null;
        }
    }

    public <T> List<T> SelectEntities(Class<T> cls, List<String> selectFieldList, Map<String, Object> whereNameValues) {
        IDataParameterList parameterList = new DataParameterList();

        List<String> fieldList = whereNameValues.keySet().stream().map(m -> String.format("%s=@%s ", m, m)).collect(Collectors.toList());
        parameterList.Set(whereNameValues);

        String selectFieldSql = selectFieldList == null ? "*" : String.join(",", selectFieldList);

        String sql = String.format("select %s from %s where %s", selectFieldSql, this._EntityType.TableName, String.join(" and ", fieldList));

        return this.SelectEntities(cls, sql, parameterList);
    }

    public <T> List<T> SelectEntities(Class<T> cls) {
        String sql = String.format("select * from %s", this._EntityType.TableName);
        return this.SelectEntities(cls, sql, null);
    }

    public <T> T SelectEntity(Class<T> cls, String sql, IDataParameterList parameterList) {
        return OpenDataAccess.Utility.Common.GetFirstOrDefault(cls, this.SelectEntities(cls, sql, parameterList));
    }

    public <T> T SelectEntity(Class<T> cls, List<String> selectFieldList, Map<String, Object> whereNameValues) {
        return OpenDataAccess.Utility.Common.GetFirstOrDefault(cls, this.SelectEntities(cls, selectFieldList, whereNameValues));
    }

    public boolean Insert(Map<String, Object> nameValues, IDataTransaction trans) {
        Set<String> nameList = nameValues.keySet();

        String sql = String.format("insert %s (%s) values (%s)", this._EntityType.TableName, String.join(",", nameList),
                String.join(",", nameList.stream().map(s -> String.format("@%s", s)).collect(Collectors.toList())));

        IDataParameterList parameterList = new DataParameterList();
        parameterList.Set(nameValues);

        return this.ExceNoQuery(sql, parameterList,trans) == 1;
    }

    public int ExceNoQuery(String sql, IDataParameterList parameterList, IDataTransaction trans) {
        try {
            return this._DataBase.ExceNoQuery(sql, parameterList,trans);
        } catch (Exception ex) {
            this.ExHandling(ex);
            return -1;
        }
    }

    public boolean Update(Map<String, Object> nameValues, String whereSql, IDataParameterList parameterList, IDataTransaction trans) {
        if (parameterList == null) {
            parameterList = new DataParameterList();
        }

        List<String> fieldList = nameValues.keySet().stream().map(m -> String.format("%s=@%s", m, m)).collect(Collectors.toList());
        parameterList.AddMap(nameValues);

        String sql = String.format("udpate %s set %s %s", this._EntityType.TableName, String.join(",", fieldList), whereSql);

        return this.ExceNoQuery(sql, parameterList,trans) == 1;
    }

    public boolean Update(Map<String, Object> nameValues, Map<String, Object> whereNameValues, IDataTransaction trans) {
        IDataParameterList parameterList = new DataParameterList();
        parameterList.Set(whereNameValues);

        List<String> fieldList = whereNameValues.keySet().stream().map(m -> String.format("%s=@%s", m, m)).collect(Collectors.toList());

        String whereSql = String.format("where %s", String.join(" and ", fieldList));

        return this.Update(nameValues, whereSql, parameterList, trans);
    }

    public boolean Update(Map<String, Object> nameValues, Object primaryKeyValue) {
        Map<String, Object> whereNameValues = new HashMap<>();
        whereNameValues.put(this._EntityType.PrimaryKey, primaryKeyValue);
        return this.Update(nameValues, whereNameValues);
    }

    public boolean Delete(Map<String, Object> whereNameValues, IDataTransaction trans) {
        IDataParameterList parameterList = new DataParameterList();
        parameterList.Set(whereNameValues);

        List<String> fieldList = whereNameValues.keySet().stream().map(m -> String.format("%s=@%s", m, m)).collect(Collectors.toList());

        String sql = String.format("delete from %s where %s", this._EntityType.TableName, String.join(" and ", fieldList));

        return this.ExceNoQuery(sql, parameterList, trans) > 0;
    }

    public boolean Delete(Object primaryKeyValue) {
        Map<String, Object> whereNameValues = new HashMap<>();
        whereNameValues.put(this._EntityType.PrimaryKey, primaryKeyValue);
        return this.Delete(whereNameValues);
    }

    public List<Map<String, Object>> SelectEntities(String sql, IDataParameterList parameterList) {
        try {
            return this._DataBase.ExceSelect(sql, parameterList);
        } catch (Exception ex) {
            this.ExHandling(ex);
            return null;
        }
    }

    public List<IEntityData> SelectEntities(IQuery query) {
        List<IEntityData> list = new ArrayList<>();

        List<Map<String, Object>> dictList = SelectEntities(query.ToSql(), query.GetParameterList());
        if (dictList == null) return list;

        EntityType entityType = EntityType.GetEntityType(query.GetEntityName(), false);

        dictList.forEach(dict -> {
            if (entityType == null) list.add(new EntityData(dict, query.GetEntityName()));
            else list.add(new EntityData(dict, entityType));
        });

        return list;
    }

    public IEntityData SelectEntity(IQuery query) {
        return OpenDataAccess.Utility.Common.GetFirstOrDefault(IEntityData.class, this.SelectEntities(query));
    }

    public IEntityData SelectEntityByPrimaryKey(Object primaryKey) {
        IQuery query = this.GetQueryByPrimaryKey(primaryKey);
        if (query != null) {
            return this.SelectEntity(query);
        }
        return null;
    }

    private IQuery GetQueryByPrimaryKey(Object primaryKey) {
        IQuery query = new Query(_EntityType.TableName);
        Property primaryKeyProperty = _EntityType.GetProperty(_EntityType.PrimaryKey);
        if (primaryKeyProperty != null) {
            primaryKeyProperty.Value = ChangeType(primaryKeyProperty.Type, primaryKey);
            IDataParameterList parameterList = new DataParameterList();
            parameterList.Set(primaryKeyProperty.Name, primaryKeyProperty.Value);
            List<WhereStatement> whereList = new ArrayList<>();
            whereList.add(new WhereStatement(primaryKeyProperty.Name, "=", primaryKeyProperty.ParameterName));
            return query.Where(whereList, parameterList);
        }
        return null;
    }

    public Object InsertEntity(EntityType entityType, IEntityData entityData, IDataTransaction trans) {

        Object primaryKey = null;
        List<String> fieldList = new ArrayList<>();
        List<String> valueList = new ArrayList<>();
        IDataParameterList parameterList = new DataParameterList();
        String propertyName = "";
        Property property = null;
        Property primaryKeyProeprty = entityType.GetProperty(entityType.PrimaryKey);
        if (primaryKeyProeprty != null && primaryKeyProeprty.Type.equals(String.class) && OpenDataAccess.Utility.Common.IsNullOrEmpty(entityData.GetStringValue(primaryKeyProeprty.Name))) {
            entityData.SetValue(primaryKeyProeprty.Name, OpenDataAccess.Utility.Common.CreateGuid());
        }

        if (this._DataBase instanceof IOracleDataBase) {
            entityData.SetValue("RowVersion", OpenDataAccess.Utility.Common.CreateGuid());
        }

        for (int i = 0; i < entityData.Count(); i++) {
            propertyName = entityData.GetPropertyName(i);
            property = entityType.GetProperty(propertyName);
            if (property != null) {
                property.Value = ChangeType(property.Type, entityData.GetValue(propertyName));
                if (property.Value != null) {
                    fieldList.add(propertyName);
                    parameterList.Set(property.Name, property.Value);
                    valueList.add(property.ParameterName);
                }
            }
        }

        boolean blInt = primaryKeyProeprty != null && (primaryKeyProeprty.Type.equals(int.class) || primaryKeyProeprty.Type.equals(long.class));

        String identitySql = "";
        if (this._DataBase instanceof ISqlDataBase && blInt) {
            if (this._DataBase.GetClientType() == ServerClient.MySqlClient) {
                identitySql = String.format("; select @@identity;", primaryKeyProeprty.Name);
            } else {
                identitySql = String.format(" select @@identity", primaryKeyProeprty.Name);
            }
        }

        String sql = "insert into ".concat(entityType.TableName).concat(" (").concat(String.join(",", fieldList)).concat(") values (").concat(String.join(",", valueList)).concat(")").concat(identitySql);

        if (this.ExceNoQuery(sql, parameterList, trans) == 1) {
            primaryKey = primaryKeyProeprty == null ? 1 : primaryKeyProeprty.Value;
        } else if (blInt) return 0;

        return primaryKey;
    }

    private Object ChangeType(Class<?> type, Object value) {
        try {
            return OpenDataAccess.Utility.Common.ChangeType(type, value);
        } catch (Exception ex) {
            this.ExHandling(ex);
            return null;
        }
    }

    private IEntityData ToEntityData(IEntity entity, List<String> fieldList) {
        try {
            return entity.ToEntityData(fieldList);
        } catch (Exception ex) {
            this.ExHandling(ex);
            return null;
        }
    }

    public Object InsertEntity(IEntityData entityData, IDataTransaction trans) {
        return this.InsertEntity(_EntityType, entityData, trans);
    }

    public Object InsertEntity(IEntity entity, List<String> fieldLis, IDataTransaction trans) {
        return this.InsertEntity(ToEntityData(entity, fieldLis), trans);
    }

    public boolean UpdateEntityByPrimaryKey(Object primaryKey, IEntityData entityData, IDataTransaction trans) {
        IQuery query = this.GetQueryByPrimaryKey(primaryKey);
        if (query != null) {
            return this.UpdateEntity(query, entityData, trans);
        }
        return false;
    }

    public boolean UpdateEntityByPrimaryKey(Object primaryKey, IEntity entity, List<String> fieldList, IDataTransaction trans) {
        return this.UpdateEntityByPrimaryKey(primaryKey, ToEntityData(entity, fieldList), trans);
    }

    public boolean UpdateEntity(EntityType entityType, IQuery query, IEntityData entityData, IDataTransaction trans) {
        List<String> fieldValueList = new ArrayList<>();
        IDataParameterList parameterList = new DataParameterList();
        String propertyName = "";
        Property property = null;

        if (this._DataBase instanceof IOracleDataBase)
            entityData.SetValue("RowVersion", OpenDataAccess.Utility.Common.CreateGuid());
        else entityData.Remove("RowVersion");

        for (int i = 0; i < entityData.Count(); i++) {
            propertyName = entityData.GetPropertyName(i);
            property = entityType.GetProperty(propertyName);
            if (property != null && property.Name != entityType.PrimaryKey) {
                property.Value = ChangeType(property.Type, entityData.GetValue(propertyName));
                parameterList.Set(property.Name, property.Value);
                fieldValueList.add(String.format("%s=%s", property.Name, property.ParameterName));
            }
        }
        String sql = "update ".concat(entityType.TableName).concat(" set ").concat(String.join(",", fieldValueList)).concat(query.ToWhereSql());
        if (query.GetParameterList() != null) {
            Map<String, Object> map = query.GetParameterList().Get();
            for (Map.Entry<String, Object> kvp : map.entrySet()) {
                parameterList.Set(kvp.getKey(), kvp.getValue());
            }
        }
        return this.ExceNoQuery(sql, parameterList, trans) == 1;
    }

    public boolean UpdateEntity(IQuery query, IEntityData entityData, IDataTransaction trans) {
        return this.UpdateEntity(_EntityType, query, entityData, trans);
    }

    public boolean UpdateEntity(IQuery query, IEntity entity, List<String> fieldList, IDataTransaction trans) {
        return this.UpdateEntity(query, ToEntityData(entity, fieldList), trans);
    }

    public boolean DeleteEntityByPrimaryKey(Object primaryKey, IDataTransaction trans) {
        IQuery query = this.GetQueryByPrimaryKey(primaryKey);
        if (query != null) {
            return this.DeleteEntity(query, trans);
        }
        return false;
    }

    public boolean DeleteEntity(IQuery query, IDataTransaction trans) {
        return this.DeleteEntity(_EntityType, query, trans);
    }

    public boolean DeleteEntity(EntityType entityType, IQuery query, IDataTransaction trans) {
        String sql = "delete from ".concat(entityType.TableName).concat(query.ToWhereSql());
        return this.ExceNoQuery(sql, query.GetParameterList(), trans) == 1;
    }
}
