using System;
using System.Collections.Generic;

namespace OpenDataAccessCore.Entity
{
    public interface IEntity
    {
        EntityType ToEntityType();
        IEntityData ToEntityData();
        IEntityData ToEntityData(List<string> fieldList);
        void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList);
        void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList);
        void DeleteValidate(List<Func<IValidate, IEntityData, string>> validateList);
        Func<IValidate, IEntityData, string> InsertValidateUnique<T>(string propertyName, string message) where T : IEntity;
        Func<IValidate, IEntityData, string> UpdateValidateUnique<T>(string propertyName, string message) where T : IEntity;
        Func<IValidate, IEntityData, string> ValidateExists<T>(string filter, string message, bool blExists = true) where T : IEntity;
    }
}
