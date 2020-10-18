using System.Collections.Generic;
using System.Data;
using OpenDataAccessCore.Data;

namespace OpenDataAccessCore.Entity
{
    public interface IEntityAccess
    {
        IDataBase CurrentDataBase { get; set; }
        EntityType EntityType { get; set; }
        List<IEntityData> SelectEntities(IQuery query);
        List<IEntityData> SelectEntities(string procName, List<IDbDataParameter> parameterList);
        List<IEntityData> SelectEntities(string entityName, string procName, List<IDbDataParameter> parameterList);
        IEntityData SelectEntity(IQuery query);
        IEntityData SelectEntity(string procName, List<IDbDataParameter> parameterList);
        IEntityData SelectEntity(string entityName, string procName, List<IDbDataParameter> parameterList);
        IEntityData SelectEntityByPrimaryKey(object primaryKey);
        bool InsertEntity(EntityType entityType, IEntityData entityData, out object primaryKey, IDbTransaction trans = null);
        bool InsertEntity(IEntityData entityData, out object primaryKey, IDbTransaction trans = null);
        bool InsertEntity(IEntity entity, List<string> fieldList, out object primaryKey, IDbTransaction trans = null);
        bool InsertEntity(EntityType entityType, IEntity entity, List<string> fieldList, out object primaryKey, IDbTransaction trans = null);
        bool UpdateEntityByPrimaryKey(object primaryKey, IEntityData entityData, IDbTransaction trans = null);
        bool UpdateEntityByPrimaryKey(object primaryKey, IEntity entity, List<string> fieldList, IDbTransaction trans = null);
        bool UpdateEntity(EntityType entityType, IQuery query, IEntityData entityData, IDbTransaction trans = null);
        bool UpdateEntity(IQuery query, IEntityData entityData, IDbTransaction trans = null);
        bool UpdateEntity(IQuery query, IEntity entity, List<string> fieldList, IDbTransaction trans = null);
        bool DeleteEntityByPrimaryKey(object primaryKey, IDbTransaction trans = null);
        bool DeleteEntity(EntityType entityType, IQuery query, IDbTransaction trans = null);
        bool DeleteEntity(IQuery query, IDbTransaction trans = null);
        IDbDataParameter GetInParameter(Property property);
        IDbDataParameter GetOutParameter(Property property);
        IDbDataParameter GetInOutParameter(Property property);

        IDbDataParameter InParameter(string name, object value);

        T SelectEntity<T>(IQuery query) where T : class;

        List<T> SelectEntities<T>(IQuery query) where T : class;
    }
}
