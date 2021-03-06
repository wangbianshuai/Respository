package OpenDataAccess.Entity;

import java.util.Map;

public interface IEntityData {

    String GetEntityName();
    void  SetEntityName(String value);

    Object GetValue(String propertyName);

    Object GetValue(int i);

    void SetValue(String propertyName, Object value);

    void SetValue(int i, Object value);

    void Remove(String propertyName);

    void Remove(int i);

    boolean ContainsKey(String key);

    <T extends IEntity> IEntity ToEntity(Class<T> cls) throws  IllegalAccessException,InstantiationException,Exception;

    Map<String, Object> ToDictionary();

    Map<String, Object> GetDictionary();

    int Count();

    String GetPropertyName(int i);

    String GetStringValue(String propertyName);

    <T> T GetValueByType(Class<T> cls, String propertyName) throws Exception;

    void SetDefaultValue(String property, Object value);
}
