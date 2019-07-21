package OpenDataAccess.Entity;

import OpenDataAccess.Data.IDataBase;
import OpenDataAccess.Data.IDataParameterList;
import OpenDataAccess.Data.IDataTransaction;
import OpenDataAccess.Data.IQuery;

import java.util.List;

public interface IEntityAccess {

    IDataBase GetDataBase();
    void SetDataBase(IDataBase value);
    EntityType GetEntityType();
    void SetEntityType(EntityType value);
    List<IEntityData> SelectEntities(IQuery query);
    List<IEntityData> SelectEntities(String procName, List<IDataParameterList> parameterList);
    List<IEntityData> SelectEntities(String entityName, String procName, List<IDataParameterList> parameterList);
    IEntityData SelectEntity(IQuery query);
    IEntityData SelectEntity(String procName, List<IDataParameterList> parameterList);
    IEntityData SelectEntity(String entityName, String procName, List<IDataParameterList> parameterList);
    IEntityData SelectEntityByPrimaryKey(Object primaryKey);
    Object InsertEntity(EntityType entityType, IEntityData entityData, IDataTransaction trans);
    Object InsertEntity(IEntityData entityData, IDataTransaction trans);
    Object InsertEntity(IEntity entity, List<String> fieldList, IDataTransaction trans);
    boolean UpdateEntityByPrimaryKey(Object primaryKey, IEntityData entityData, IDataTransaction trans);
    boolean UpdateEntityByPrimaryKey(Object primaryKey, IEntity entity, List<String> fieldList, IDataTransaction trans);
    boolean UpdateEntity(EntityType entityType, IQuery query, IEntityData entityData, IDataTransaction trans);
    boolean UpdateEntity(IQuery query, IEntityData entityData, IDataTransaction trans);
    boolean UpdateEntity(IQuery query, IEntity entity, List<String> fieldList, IDataTransaction trans);
    boolean DeleteEntityByPrimaryKey(Object primaryKey, IDataTransaction trans);
    boolean DeleteEntity(EntityType entityType, IQuery query, IDataTransaction trans);
    boolean DeleteEntity(IQuery query, IDataTransaction trans);
    IDataParameterList GetInParameter(Property property);
    IDataParameterList GetOutParameter(Property property);
    IDataParameterList GetInOutParameter(Property property);
}
