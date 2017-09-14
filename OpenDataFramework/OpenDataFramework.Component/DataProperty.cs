using EntityDataService.Data;
using EntityDataService.Entity;
using EntityDataService.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Component
{
    public class DataProperty : EntityRequest
    {
        public DataProperty()
        {
            this.EntityType = EntityDataService.Entity.EntityType.GetEntityType<OpenDataFramework.Entity.DataProperty>();
        }

        public DataProperty(Request request)
            : base(request)
        {
        }

        public List<IEntityData> GetDataPropertyList(Guid entityId)
        {
            IQuery query = new Query(this.EntityType.TableName);
            if (entityId != Guid.Empty)
            {
                query.Where(string.Format("where EntityId='{0}'", entityId));
            }
            return this.SelectEntities(query);
        }
    }
}
