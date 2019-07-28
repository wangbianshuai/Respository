package OpenDataAccess.Entity;

import OpenDataAccess.Utility.Common;
import OpenDataAccess.Utility.JsonParse;

import java.util.*;
import java.util.stream.Collectors;

public class EntityData implements IEntityData {
    private Map<String, Object> _data = new HashMap<>();
    String _PropertyName = null;
    private EntityType _EntityType = null;
    private String _EntityName = "";

    public String GetEntityName() {
        return _EntityName;
    }

    public void SetEntityName(String value) {
        _EntityName = value;
    }

    public EntityData(String entityName) {
        _EntityName = entityName;
    }

    public EntityData(Map<String, Object> dict, String entityName) {
        _data = dict;
        _EntityName = entityName;
    }

    public EntityData(Map<String, Object> dict) {
        _data = dict;
    }

    public EntityData(Map<String, Object> dict, EntityType entityType) {
        _data = new HashMap<>();
        _EntityType = entityType;
        _EntityName = _EntityType.Name;

        Map<String, String> names = new HashMap<>();
        List<String> keyList = dict.keySet().stream().collect(Collectors.toList());

        entityType.Properties.forEach(p -> {
            String key = Common.GetFirstOrDefault(String.class, keyList, e -> e.toLowerCase().equals(p.Name.toLowerCase()));
            if (!Common.IsNullOrEmpty(key)) names.put(p.Name, key);
        });

        if (names.size() > 0) {
            for (Map.Entry<String, String> kvp : names.entrySet()) {
                _data.put(kvp.getKey(), dict.get(kvp.getValue()));
            }
        } else _data = dict;
    }

    public EntityData(EntityType entityType) {
        _EntityType = entityType;
        _EntityName = _EntityType.Name;
    }

    public Object GetValue(String propertyName) {
        if (_data.containsKey(propertyName)) {
            return _data.get(propertyName);
        } else {
            for (Map.Entry<String, Object> kvp : _data.entrySet()) {
                if (kvp.getKey().toLowerCase().equals(propertyName.toLowerCase())) return kvp.getValue();
            }
            return null;
        }
    }

    public Object GetValue(int i) {
        _PropertyName = GetPropertyName(i);
        if (_data.containsKey(_PropertyName)) {
            return _data.get(_PropertyName);
        }
        return null;
    }

    public void SetValue(String propertyName, Object value) {
        _data.put(propertyName, value);
    }

    public void SetDefaultValue(String propertyName, Object value) {
        String strValue = GetStringValue(propertyName);
        if (Common.IsNullOrEmpty(strValue)) SetValue(propertyName, value);
    }

    public void SetValue(int i, Object value) {
        _PropertyName = GetPropertyName(i);
        _data.put(_PropertyName, value);
    }

    public void Remove(String propertyName) {
        if (_data.containsKey(propertyName)) {
            _data.remove(propertyName);
        }
    }

    public boolean ContainsKey(String key) {
        return _data.containsKey(key);
    }

    public void Remove(int i) {
        _PropertyName = GetPropertyName(i);
        if (_data.containsKey(_PropertyName)) {
            _data.remove(_PropertyName);
        }
    }

    public <T extends IEntity> IEntity ToEntity(Class<T> cls) throws IllegalAccessException, InstantiationException, Exception {
        return JsonParse.MapTo(cls, ToDictionary());
    }

    public Map<String, Object> ToDictionary() {
        return ToDictionary(_data);
    }

    public Map<String, Object> GetDictionary() {
        return _data;
    }

    private Map<String, Object> ToDictionary(Map<String, Object> dict) {
        Map<String, Object> newDict = new HashMap<>();
        String key = "";
        Object value = null;
        List<IEntityData> list = new ArrayList<>();
        for (Map.Entry<String, Object> kvp : _data.entrySet()) {
            key = kvp.getKey();
            value = kvp.getValue();
            if (value instanceof IEntityData) {
                newDict.put(key, ((IEntityData) value).ToDictionary());
            } else if (value != null && value instanceof List<?>) {
                if (!((List) value).isEmpty()) {
                    Object ele = ((List) value).get(0);
                    if (ele instanceof IEntityData) {
                        List<Map<String, Object>> dictList = new ArrayList<>();
                        ((List<IEntityData>) value).forEach(entityData -> {
                            dictList.add(entityData.ToDictionary());
                        });
                        newDict.put(key, dictList);
                    } else newDict.put(key, value);
                } else newDict.put(key, value);
            } else {
                newDict.put(key, value);
            }
        }
        return newDict;
    }

    public int Count() {
        return _data.size();
    }

    public String GetPropertyName(int i) {
        Object[] propertyNameList = _data.keySet().toArray();
        if (i < propertyNameList.length) return (String) propertyNameList[i];
        return "";
    }

    public String GetStringValue(String propertyName) {
        if (this._data.containsKey(propertyName) && this._data.get(propertyName) != null) {
            return this._data.get(propertyName).toString();
        } else {
            Object value = this.GetValue(propertyName);
            return value == null ? "" : value.toString();
        }
    }

    public <T> T GetValueByType(Class<T> cls, String propertyName) throws Exception {
        if (this._data.containsKey(propertyName) && this._data.get(propertyName) != null) {
            return Common.ConvertValue(cls, _data.get(propertyName));
        }
        return Common.ConvertValue(cls, this.GetValue(propertyName));
    }
}
