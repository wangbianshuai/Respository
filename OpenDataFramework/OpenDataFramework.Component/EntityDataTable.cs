using EntityDataService.Entity;
using EntityDataService.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Component
{
    public class EntityDataTable : EntityRequest
    {
        public EntityDataTable()
        {
            this.EntityType = EntityDataService.Entity.EntityType.GetEntityType<OpenDataFramework.Entity.EntityDataTable>();
        }

        public EntityDataTable(Request request)
            : base(request)
        {
        }

        public RequestEntity GetRequestEntity(Guid dataId)
        {
            IEntityData entityData = this.SelectEntityByPrimaryKey(dataId);
            if (entityData == null) return null;

            return RequestEntityType.RequestEntityList.Where(w => w.EntityId == entityData.GetValue<Guid>("EntityId")).FirstOrDefault();
        }
    }
}
