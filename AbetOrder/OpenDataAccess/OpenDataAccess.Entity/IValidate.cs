using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataAccess.Entity
{
    public interface IValidate
    {
        string InsertValidateUnique<T>(IEntityData entityData, string propertyName, string message) where T : IEntity;
        string UpdateValidateUnique<T>(IEntityData entityData, string propertyName, string message) where T : IEntity;
        string ValidateExists<T>(IEntityData entityData, string filter, string message, bool blExists = true) where T : IEntity;
        string Validate();
        string Validate(IEntityData entityData, List<Func<IValidate, IEntityData, string>> validateList);
    }
}
