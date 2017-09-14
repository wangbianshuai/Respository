using EntityDataService.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Component
{
    public class DataOperationTableLog : EntityRequest
    {
        public DataOperationTableLog()
        {
            this.EntityType = EntityDataService.Entity.EntityType.GetEntityType<OpenDataFramework.Entity.DataOperationTableLog>();
        }

        public DataOperationTableLog(Request request)
            : base(request)
        {
        }

        public void InsertLogList(List<Entity.DataOperationTableLog> entityList)
        {
            object primaryKey = null;
            List<string> fieldList = this.EntityType.Properties.Select(s => s.Name).ToList();

            entityList.ForEach(e =>
            {
                this.InsertEntity(e, fieldList, out primaryKey);
            });
        }
    }
}
