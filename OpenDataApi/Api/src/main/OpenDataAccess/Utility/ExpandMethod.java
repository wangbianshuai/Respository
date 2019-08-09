package OpenDataAccess.Utility;

import java.util.Map;

public class ExpandMethod {
    public static String GetStringValue(Map<String, Object> dict, String propertyName) {
        if (dict.containsKey(propertyName) && dict.get(propertyName) != null) {
            return dict.get(propertyName).toString();
        }
        return "";
    }

    public static Object GetValue(Map<String, Object> dict, String propertyName) {
        if (dict.containsKey(propertyName) && dict.get(propertyName) != null) {
            return dict.get(propertyName);
        }
        return null;
    }

    public static <T> T GetValueToType(Class<T> cls, Map<String, Object> dict, String propertyName) throws Exception {
        if (dict.containsKey(propertyName) && dict.get(propertyName) != null) {
            Object value = dict.get(propertyName);
            if (dict.get(propertyName).getClass().equals(cls.getClass())) return (T) value;
            else {
                value = Common.ChangeType(cls, value);
                if (value != null) return (T) value;
            }
        }
        return (T) Common.GetTypeDefaultValue(cls);
    }
}