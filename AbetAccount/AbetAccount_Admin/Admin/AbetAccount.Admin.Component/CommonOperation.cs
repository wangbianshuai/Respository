using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using OpenDataAccessCore.Data;

namespace AbetAccount.Admin.Component
{
    public class CommonOperation
    {
        public static object DeleteByLogic<T>(T entityRequest, List<DeleteRelationEntity> relationList = null) where T : IEntityRequest
        {
            Guid primaryKey = Guid.Parse(entityRequest._QueryRequest.PrimaryKeyProperty.Value.ToString());
            string rowVersion = entityRequest._QueryRequest.GetParameterValue("RowVersion");

            IEntityData entityData = new EntityData(entityRequest.EntityType);
            entityData.SetValue("IsDelete", 1);

            IEntityData oldEntityData = entityRequest.SelectEntityByPrimaryKey(primaryKey);

            if (oldEntityData == null)
            {
                return entityRequest.GetBoolDict(false);
            }

            if (!string.IsNullOrEmpty(rowVersion))
            {
                entityData.SetValue("RowVersion", rowVersion);
                string message = entityRequest.CompareVersion(entityData, oldEntityData);
                if (!string.IsNullOrEmpty(message))
                {
                    return entityRequest.GetMessageDict(message);
                }
            }

            if (relationList != null)
            {
                foreach (var r in relationList)
                {
                    if (IsExistsRelation(entityRequest, r, primaryKey)) return entityRequest.GetMessageDict(r.Message);
                }
            }

            return entityRequest.GetBoolDict(entityRequest.UpdateEntityByPrimaryKey(primaryKey, entityData));
        }

        static bool IsExistsRelation(IEntityRequest entityRequest, DeleteRelationEntity relation, Guid id)
        {
            IQuery query = new Query(relation.Entity.TableName);
            query.Select(relation.Entity.PrimaryKey);
            string isDeleteWhere = relation.Entity.Properties.Exists(p => p.Name == "IsDelete") ? "and IsDelete=0" : string.Empty;
            query.Where(string.Format("where {0}='{1}'{2}", relation.PropertyName, id, isDeleteWhere));
            return entityRequest.SelectEntity(query) != null;
        }
    }

    public class DeleteRelationEntity
    {
        public EntityType Entity { get; set; }
        public string Message { get; set; }
        public string PropertyName { get; set; }

        public DeleteRelationEntity(EntityType entity, string message, string propertyName)
        {
            Entity = entity;
            Message = message;
            PropertyName = propertyName;
        }
    }
}
