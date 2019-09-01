package OpenDataAccess.Entity;

import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.List;

public interface IEntity {
    EntityType ToEntityType();

    IEntityData ToEntityData() throws  IllegalAccessException;

    IEntityData ToEntityData(List<String> fieldList)throws  IllegalAccessException;

    void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList);

    void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList);

    void DeleteValidate(List<IFunction2<IValidate, IEntityData, String>> validateList);

    <T extends  IEntity> IFunction2<IValidate, IEntityData, String> InsertValidateUnique(Class<T> cls,String propertyName, String message);
    <T extends  IEntity> IFunction2<IValidate, IEntityData, String> UpdateValidateUnique(Class<T> cls,String propertyName, String message);
    <T extends  IEntity> IFunction2<IValidate, IEntityData, String> ValidateExists(Class<T> cls,String filter, String message, boolean blExists);
}
