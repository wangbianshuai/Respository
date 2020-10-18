using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataAccessCore.Entity
{
    public class EntityType
    {
        public string Name { get; set; }
        public string TableName { get; set; }
        public string WithSql { get; set; }
        public string PrimaryKey { get; set; }
        public bool IsGet { get; set; }
        public bool IsPost { get; set; }
        public bool IsPut { get; set; }
        public bool IsDelete { get; set; }
        public List<string> NoSelectNameList { get; set; }
        public LogAttribute LogAttribute { get; set; }
        public List<Property> Properties { get; set; }
        public List<Func<IValidate, IEntityData, string>> InsertValidateList { get; set; }
        public List<Func<IValidate, IEntityData, string>> UpdateValidateList { get; set; }
        public List<Func<IValidate, IEntityData, string>> DeleteValidateList { get; set; }


        /// <summary>
        /// 是否有AppAccountId
        /// </summary>
        public bool HasAppAccountId { get; set; }

        public EntityType()
        {
            this.InsertValidateList = new List<Func<IValidate, IEntityData, string>>();
            this.UpdateValidateList = new List<Func<IValidate, IEntityData, string>>();
            this.DeleteValidateList = new List<Func<IValidate, IEntityData, string>>();
        }

        public static ConcurrentBag<EntityType> EntityTypeList = new ConcurrentBag<EntityType>();

        public static EntityType GetEntityType(string name, bool blClone = false)
        {
            if (string.IsNullOrEmpty(name))
            {
                return null;
            }
            EntityType entityType = EntityTypeList.Where(where => where.Name.Trim().ToLower() == name.Trim().ToLower()).FirstOrDefault();
            if (entityType != null && blClone)
            {
                EntityType newEntityType = new EntityType();
                newEntityType.DeleteValidateList = entityType.DeleteValidateList;
                newEntityType.InsertValidateList = entityType.InsertValidateList;
                newEntityType.Name = entityType.Name;
                newEntityType.PrimaryKey = entityType.PrimaryKey;
                newEntityType.IsDelete = entityType.IsDelete;
                newEntityType.IsGet = entityType.IsGet;
                newEntityType.IsPost = entityType.IsPost;
                newEntityType.IsPut = entityType.IsPut;
                newEntityType.LogAttribute = entityType.LogAttribute;
                if (entityType.Properties != null)
                {
                    newEntityType.Properties = (from a in entityType.Properties
                                                select new Property()
                                                {
                                                    Name = a.Name,
                                                    ParameterName = a.ParameterName,
                                                    Type = a.Type,
                                                    IsSelect = a.IsSelect
                                                }).ToList();
                }
                newEntityType.TableName = entityType.TableName;
                newEntityType.WithSql = entityType.WithSql;
                newEntityType.UpdateValidateList = entityType.UpdateValidateList;
                return newEntityType;
            }
            return entityType;
        }

        public static EntityType GetEntityType<T>() where T : IEntity
        {
            EntityType entityType = EntityType.GetEntityType(typeof(T).Name);
            if (entityType == null)
            {
                EntityType.SetEntityType<T>();
                entityType = EntityType.GetEntityType(typeof(T).Name);
            }
            return entityType;
        }

        public static void SetEntityType<T>() where T : IEntity
        {
            if (EntityTypeList.Where(exists => exists.Name == typeof(T).Name).FirstOrDefault() == null)
            {
                T entity = Activator.CreateInstance<T>();
                EntityTypeList.Add(entity.ToEntityType());
            }
        }

        public static void SetEntityType(Type type)
        {
            if (EntityTypeList.Where(exists => exists.Name == type.Name).FirstOrDefault() == null)
            {
                IEntity entity = Activator.CreateInstance(type) as IEntity;
                if (entity != null)
                {
                    EntityTypeList.Add(entity.ToEntityType());
                }
            }
        }

        public static void SetEntityType(object obj)
        {
            if (EntityTypeList.Where(exists => exists.Name == obj.GetType().Name).FirstOrDefault() == null)
            {
                IEntity entity = obj as IEntity;
                if (entity != null)
                {
                    EntityTypeList.Add(entity.ToEntityType());
                }
            }
        }

        public Property GetProperty(string name)
        {
            return string.IsNullOrEmpty(name) ? null : this.Properties.Where(where => where.Name.Trim().ToLower() == name.Trim().ToLower()).FirstOrDefault();
        }

        public List<Property> GetPropertyList(List<string> propertyNameList)
        {
            return (from property in this.Properties
                    from proeprtyName in propertyNameList
                    where property.Name.Trim().ToLower() == proeprtyName.Trim().ToLower()
                    select property).ToList();
        }

    }
}
