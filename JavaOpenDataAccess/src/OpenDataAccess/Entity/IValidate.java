package OpenDataAccess.Entity;

import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.List;

public interface IValidate {
    <T extends IEntity> String InsertValidateUnique(IEntityData entityData, String propertyName, String message);
    <T extends IEntity> String UpdateValidateUnique(IEntityData entityData, String propertyName, String message);
    <T extends IEntity> String ValidateExists(IEntityData entityData, String filter, String message, boolean blExists);
    String Validate();
    String Validate(IEntityData entityData, List<IFunction2<IValidate, IEntityData, String>> validateList);
}
