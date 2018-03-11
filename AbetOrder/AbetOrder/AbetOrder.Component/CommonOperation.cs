using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class CommonOperation
    {
        public static object DeleteByLogic<T>(T entityRequest) where T : IEntityRequest
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

            return entityRequest.GetBoolDict(entityRequest.UpdateEntityByPrimaryKey(primaryKey, entityData));
        }
    }
}
