using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataAccess.Entity
{
    public class EntityModel : IEntity
    {
        public EntityType ToEntityType()
        {
            EntityType entityType = null;
            entityType = EntityType.GetEntityType(this.GetType().Name);
            if (entityType != null)
            {
                return entityType;
            }
            entityType = new EntityType();
            entityType.Name = this.GetType().Name;
            entityType.Properties = new List<Property>();

            TablePropertyAttribute tableProperty = this.GetType().GetCustomAttributes(typeof(TablePropertyAttribute), false).FirstOrDefault() as TablePropertyAttribute;
            if (tableProperty != null)
            {
                entityType.TableName = tableProperty.Name;
                entityType.PrimaryKey = tableProperty.PrimaryKey;
                entityType.NoSelectNameList = string.IsNullOrEmpty(tableProperty.NoSelectNames) ? new List<string>() : tableProperty.NoSelectNames.Split(',').ToList();
            }

            RequestMethodAttribute requestMethodProperty = this.GetType().GetCustomAttributes(typeof(RequestMethodAttribute), false).FirstOrDefault() as RequestMethodAttribute;
            if (requestMethodProperty != null)
            {
                entityType.IsDelete = requestMethodProperty.IsDelete;
                entityType.IsGet = requestMethodProperty.IsGet;
                entityType.IsPost = requestMethodProperty.IsPost;
                entityType.IsPut = requestMethodProperty.IsPut;
            }
            else
            {
                entityType.IsDelete = true;
                entityType.IsGet = true;
                entityType.IsPost = true;
                entityType.IsPut = true;
            }

            LogAttribute logAttribute = this.GetType().GetCustomAttributes(typeof(LogAttribute), false).FirstOrDefault() as LogAttribute;
            if (logAttribute != null)
            {
                entityType.LogAttribute = logAttribute;
            }
            else
            {
                entityType.LogAttribute = new LogAttribute();
            }

            this.GetType().GetProperties().ToList().ForEach(propertyInfo =>
            {
                entityType.Properties.Add(new Property()
                {
                    Name = propertyInfo.Name,
                    Type = propertyInfo.PropertyType,
                    IsSelect=  !entityType.NoSelectNameList.Contains(propertyInfo.Name)
                });
            });
            this.InsertValidate(entityType.InsertValidateList);
            this.UpdateValidate(entityType.UpdateValidateList);
            this.DeleteValidate(entityType.DeleteValidateList);
            return entityType;
        }

        public IEntityData ToEntityData()
        {
            IEntityData entityData = new EntityData(this.ToEntityType());
            this.GetType().GetProperties().ToList().ForEach(property =>
            {
                object value = property.GetValue(this, null);
                if (value != null)
                {
                    entityData.SetValue(property.Name, value);
                }
            });
            return entityData;
        }

        public IEntityData ToEntityData(List<string> fieldList)
        {
            IEntityData entityData = new EntityData(this.ToEntityType());
            var propertyList = (from propertyInfo in this.GetType().GetProperties()
                                from field in fieldList
                                where field.Trim().ToLower() == propertyInfo.Name.Trim().ToLower()
                                select propertyInfo).ToList();
            propertyList.ForEach(property =>
            {
                entityData.SetValue(property.Name, property.GetValue(this, null));
            });
            return entityData;
        }

        public virtual void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
           
        }

        public virtual void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
          
        }

        public virtual void DeleteValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {

        }

        public Func<IValidate, IEntityData, string> InsertValidateUnique<T>(string propertyName, string message) where T : IEntity
        {
            return (valiate, entityData) =>
            {
                return valiate.InsertValidateUnique<T>(entityData, propertyName, message);
            };
        }

        public Func<IValidate, IEntityData, string> UpdateValidateUnique<T>(string propertyName, string message) where T : IEntity
        {
            return (valiate, entityData) =>
            {
                return valiate.UpdateValidateUnique<T>(entityData, propertyName, message);
            };
        }

        public Func<IValidate, IEntityData, string> ValidateExists<T>(string filter, string message, bool blExists = true) where T : IEntity
        {
            return (valiate, entityData) =>
            {
                return valiate.ValidateExists<T>(entityData, filter, message, blExists);
            };
        }
    }
}
