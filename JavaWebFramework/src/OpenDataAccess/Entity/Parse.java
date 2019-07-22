package OpenDataAccess.Entity;

import OpenDataAccess.Utility.Common;
import OpenDataAccess.Utility.JsonParse;

import java.io.IOException;
import java.util.*;

public class Parse
{
    public static List<Map<String, Object>> ToDictionaryList(Object obj) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (obj != null && obj.getClass().equals(list.getClass())) {
            return (List<Map<String, Object>>) obj;
        } else if (obj instanceof Map) {
            list.add((Map<String, Object>) obj);
        }
        return list;
    }

    //将包含IEntityData Map转化Map
    public static Map<String, Object> DictionaryToMap(Map<String, Object> dict) {
        Map<String, Object> map = new HashMap<>();
        List<Map<String, Object>> dictList = new ArrayList<>();
        List<IEntityData> entityDataList = new ArrayList<>();

        for (Map.Entry<String, Object> kvp : dict.entrySet()) {
            String key = kvp.getKey();
            Object value = kvp.getValue();
            if (value != null) {
                if (value instanceof Map) {
                    map.put(key, DictionaryToMap((Map<String, Object>) value));
                } else if (value.getClass().equals(dictList.getClass())) {
                    map.put(key, DictionaryListToMapList((List<Map<String, Object>>) value));
                } else if (value instanceof IEntityData) {
                    map.put(key, ((IEntityData) value).ToDictionary());
                } else if (value.getClass().equals(entityDataList.getClass())) {
                    map.put(key, IEntityDataToListMapList((List<IEntityData>) value));
                } else map.put(key, value);
            } else map.put(key, value);
        }
        return map;
    }

    public  static  List<Map<String, Object>> DictionaryListToMapList( List<Map<String, Object>> dictList) {
        List<Map<String, Object>> list = new ArrayList<>();
        dictList.forEach(d -> list.add(DictionaryToMap(d)));
        return list;
    }

    public static  List<Map<String,Object>> IEntityDataToListMapList(List<IEntityData> entityDataList) {
        List<Map<String, Object>> list = new ArrayList<>();
        entityDataList.forEach(d -> list.add(d.ToDictionary()));
        return list;
    }

    public static <T> List<T> MapListToList(Class<T> cls, List<Map<String, Object>> dictList) throws InstantiationException, IllegalAccessException, Exception {
        List<T> objList = new ArrayList<>();
        dictList = DictionaryListToMapList(dictList);
        for (int i = 0; i < dictList.size(); i++) {
            objList.add(JsonParse.MapTo(cls, dictList.get(i)));
        }
        return objList;
    }

    public static String ToJson(Object obj) throws IOException,IllegalAccessException {
        if (obj == null) return "";

        if (obj instanceof Map) {
            Map<String, Object> map = DictionaryToMap((Map<String, Object>) obj);
            return JsonParse.ToJson(map);
        } else if (obj instanceof ArrayList) {
            ArrayList arrayList = (ArrayList) obj;
            if (arrayList.isEmpty()) return "[]";

            Object ele = arrayList.get(0);
            if (ele instanceof Map) {
                return JsonParse.ToJson((DictionaryListToMapList((List<Map<String, Object>>) obj)));
            } else if (ele instanceof IEntity) {
                return IEntityListToJsonByIEntity((List<IEntity>) obj);
            } else if (ele instanceof IEntityData) {
                return IEntityDataListToJson((List<IEntityData>) obj);
            } else return JsonParse.ToJson(obj);
        } else if (obj instanceof IEntity) {
            return IEntityToJson((IEntity) obj);
        } else if (obj instanceof IEntityData) {
            return IEntityToJson((IEntityData) obj);
        } else return JsonParse.ToJson(obj);
    }

    public static String IEntityToJson(IEntity entity) throws IOException,IllegalAccessException {
        return IEntityToJson(entity.ToEntityData());
    }

    public static <T> T IEntityDataTo(Class<T> cls, IEntityData entityData) throws IllegalAccessException,InstantiationException,Exception {
        return JsonParse.MapTo(cls, entityData.ToDictionary());
    }

    public static <T> List<T> IEntityDataListT(Class<T> cls, List<IEntityData> entityDataList) throws IllegalAccessException,InstantiationException,Exception {
        List<T> list = new ArrayList<>();
        for (int i=0;i< entityDataList.size();i++) {
            list.add(IEntityDataTo(cls, entityDataList.get(i)));
        }
        return list;
    }

    public static String IEntityListToJsonByIEntity(List<IEntity> entityList) throws IOException,IllegalAccessException {
        String entityName = "";
        List<Map<String, Object>> dictList = new ArrayList<>();
        if (entityList.size() > 0) {
            entityName = entityList.get(0).getClass().getName();
        }
        for (int i=0; i< entityList.size();i++) {
            dictList.add(entityList.get(i).ToEntityData().ToDictionary());
        }
        if (!Common.IsNullOrEmpty(entityName)) {
            Map<String, Object> dict = new HashMap<>();
            dict.put(entityName, dictList);
            return JsonParse.ToJson(dict);
        } else return JsonParse.ToJson(dictList);
    }

    public static <T extends IEntity> String IEntityToJson(Class<T> cls, T entity)throws IOException,IllegalAccessException {
        return IEntityToJson(entity.ToEntityData());
    }

    public static <T extends IEntity> String IEntityListToJson(List<T> entityList) throws IOException,IllegalAccessException{
        String entityName = "";
        List<Map<String, Object>> dictList = new ArrayList<>();
        if (entityList.size() > 0) {
            entityName = entityList.get(0).getClass().getName();
        }
        for (int i=0; i< entityList.size();i++) {
            dictList.add(entityList.get(i).ToEntityData().ToDictionary());
        }
        if (!Common.IsNullOrEmpty(entityName)) {
            Map<String, Object> dict = new HashMap<>();
            dict.put(entityName, dictList);
            return JsonParse.ToJson(dict);
        } else return JsonParse.ToJson(dictList);
    }

    public static String IEntityToJson(IEntityData entityData) throws IOException,IllegalAccessException
    {
        if (!Common.IsNullOrEmpty(entityData.GetEntityName()))
        {
            Map<String, Object> dict = new HashMap<>();
            dict.put(entityData.GetEntityName(), entityData.ToDictionary());
            return JsonParse.ToJson(dict);
        }
        else return JsonParse.ToJson(entityData.ToDictionary());
    }

    public static List<Map<String, Object>> IEntityDataToMapList(List<IEntityData> entityDataList) {
        List<Map<String, Object>> dictList = new ArrayList<>();
        entityDataList.forEach(entityData ->
        {
            dictList.add(entityData.ToDictionary());
        });
        return dictList;
    }

    public static String IEntityDataListToJson(List<IEntityData> entityDataList) throws IOException,IllegalAccessException{
        String entityName = "";
        List<Map<String, Object>> dictList = new ArrayList<>();
        if (entityDataList.size() > 0) {
            entityName = entityDataList.get(0).GetEntityName();
        }
        entityDataList.forEach(entityData ->
        {
            dictList.add(entityData.ToDictionary());
        });
        if (!Common.IsNullOrEmpty(entityName)) {
            Map<String, Object> dict = new HashMap<>();
            dict.put(entityName, dictList);
            return JsonParse.ToJson(dict);
        } else return JsonParse.ToJson(dictList);
    }

    public static <T extends IEntity> T MapToIEntity(Class<T> cls, Map<String, Object> dict) throws IllegalAccessException,InstantiationException,Exception
    {
        return (T)new EntityData(dict).ToEntity(cls);
    }

    public static List<IEntityData> MapListToIEntityDataList(List<Map<String, Object>> dictList) {
        List<IEntityData> entityDataList = new ArrayList<>();
        dictList.forEach(dict ->
        {
            entityDataList.add(new EntityData(dict));
        });
        return entityDataList;
    }

    public static <T extends IEntity> List<T> MapListToIEntityList(Class<T> cls, List<Map<String, Object>> dictList)throws IllegalAccessException,InstantiationException,Exception {
        List<T> entityDataList = new ArrayList<>();
        for (int i = 0; i < dictList.size(); i++) {
            entityDataList.add(MapToIEntity(cls, dictList.get(i)));
        }
        return entityDataList;
    }
}
