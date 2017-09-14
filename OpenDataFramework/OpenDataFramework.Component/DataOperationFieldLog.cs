using EntityDataService.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Component
{
    public class DataOperationFieldLog : EntityRequest
    {
        public DataOperationFieldLog()
        {
            this.EntityType = EntityDataService.Entity.EntityType.GetEntityType<OpenDataFramework.Entity.DataOperationFieldLog>();
        }

        public DataOperationFieldLog(Request request)
            : base(request)
        {
        }

        public void InsertLogList(List<Entity.DataOperationFieldLog> entityList)
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
