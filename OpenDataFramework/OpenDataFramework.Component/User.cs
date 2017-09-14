using EntityDataService.Entity;
using EntityDataService.Service;
using EntityDataService.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Component
{
    public class User : EntityRequest
    {
        public User()
        {
            this.EntityType = EntityDataService.Entity.EntityType.GetEntityType<OpenDataFramework.Entity.User>();
        }

        public User(Request request)
            : base(request)
        {
        }

        public object EditEntity()
        {
            switch (this._Request.RequestType)
            {
                case "Create": return this.Insert();
                case "Update": return this.Update();
                default: return null;
            }
        }

        public object ExcelInsert(Dictionary<string, object> dict)
        {
            IEntityData entityData = new EntityData(dict, this.EntityType);

            string createDate = entityData.GetStringValue("CreateDate");
            if (!string.IsNullOrEmpty(createDate))
            {
                entityData.SetValue("CreateDate", Common.GetDateValue(createDate));
            }

            object primaryKey = null;

            string message = this.Validate(entityData, this.EntityType.InsertValidateList);
            if (!string.IsNullOrEmpty(message))
            {
                return message;
            }

            if (this.InsertEntity(entityData, out primaryKey))
            {
                return true;
            }

            return "导入失败！";
        }
    }
}
