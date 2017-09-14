using EntityDataService.Entity;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Component
{
    public static class RequestEntityType
    {
        public static string VesionId { get; set; }

        static RequestEntityType()
        {
            InitEntityType();
        }

        public static ConcurrentQueue<RequestEntity> RequestEntityList = new ConcurrentQueue<RequestEntity>();

        public static void InitEntityType()
        {
            EntityType.EntityTypeList = new List<EntityType>();
            EntityType.SetEntityType<OpenDataFramework.Entity.DataProperty>();
            EntityType.SetEntityType<OpenDataFramework.Entity.DateDataTable>();
            EntityType.SetEntityType<OpenDataFramework.Entity.DataEntity>();
            EntityType.SetEntityType<OpenDataFramework.Entity.EntityDataTable>();
            EntityType.SetEntityType<OpenDataFramework.Entity.ExpandStringTable>();
            EntityType.SetEntityType<OpenDataFramework.Entity.FloatDataTable>();
            EntityType.SetEntityType<OpenDataFramework.Entity.GuidDataTable>();
            EntityType.SetEntityType<OpenDataFramework.Entity.IntDataTable>();
            EntityType.SetEntityType<OpenDataFramework.Entity.OperationLog>();
            EntityType.SetEntityType<OpenDataFramework.Entity.StringDataTable>();
            EntityType.SetEntityType<OpenDataFramework.Entity.User>();
            EntityType.SetEntityType<OpenDataFramework.Entity.ViewDataOperationLog>();
            EntityType.SetEntityType<OpenDataFramework.Entity.DataOperationFieldLog>();

            GetRequestEntityType();
        }

        private static void GetRequestEntityType()
        {
            RequestEntityList = new ConcurrentQueue<RequestEntity>();
            new DataEntity().GetRequestEntityList().ForEach(e =>
            {
                RequestEntityList.Enqueue(e);
            });
        }

        public static RequestEntity GetRequestEntity(string entityName)
        {
            List<string> entityNameList = new List<string>() { "User", "DataEntity", "DataProperty", "OperationLog", "ViewDataOperationLog", "DataOperationFieldLog" };
            EntityType entityType = EntityType.GetEntityType(entityName);
            if (entityType != null)
            {
                if (!entityNameList.Contains(entityType.Name))
                {
                    return null;
                }

                return new RequestEntity()
                {
                    EntityType = entityType,
                    EntityName = entityType.Name,
                    PrimaryKey = entityType.PrimaryKey,
                    MainTableName = entityType.TableName,
                    Properties = (from a in entityType.Properties
                                  select new RequestProperty()
                                  {
                                      FieldName = a.Name,
                                      PropertyName = a.Name,
                                      TableName = string.Empty
                                  }).ToList()
                };
            }
            return RequestEntityList.Where(w => !w.IsRemove && w.EntityName.ToLower().Equals(entityName.ToLower())).FirstOrDefault();
        }

        public static void UpdateRequestEntity(RequestEntity entity)
        {
            RequestEntity data = RequestEntityList.Where(w => w.EntityId == entity.EntityId).FirstOrDefault();
            if (data == null)
            {
                RequestEntityList.Enqueue(entity);
            }
            else
            {
                data.EntityName = entity.EntityName;
                data.KeyNames = entity.KeyNames;
                data.Properties = entity.Properties;
            }
        }

        public static void RemoveRequestEntity(Guid entityId)
        {
            RequestEntity data = RequestEntityList.Where(w => w.EntityId == entityId).FirstOrDefault();
            if (data != null)
            {
                data.IsRemove = true;
            }
        }
    }
}
