package OpenDataAccess.Utility;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;

/**
 * Created by Bianshuai on 2017/1/9.
 */
public class JsonParse {

    private static final String FormatMessage = "JSON字符串格式不正确！";

    public static String ToJson(Object obj) throws IOException, IllegalAccessException {
        if (obj == null) {
            return "";
        }

        return GetOutpuStream(obj).toString();
    }

    private static String GetOutpuStream(Object obj) throws IOException, IllegalAccessException {
        String output = null;
        if (obj instanceof ArrayList) {
            output = ToJsonByArray((ArrayList) obj);
        } else if (obj instanceof Map) {
            output = ToJsonByMap((Map<String, Object>) obj);
        } else if (obj.getClass().isArray()) {
            output = GetBaseArrayJson(obj);
        } else {
            output = GetBaseTypeJson(obj);
        }
        return output;
    }

    private static String GetBaseArrayJson(Object obj) throws IOException, IllegalAccessException {
        String output = null;
        List<String> valueList = null;

        if (obj instanceof byte[]) {
            valueList = new ArrayList<String>();
            byte[] arrs = (byte[]) obj;
            for (int i = 0; i < arrs.length; i++) {
                valueList.add(GetBaseTypeValue(arrs[i]));
            }
        } else if (obj instanceof char[]) {
            valueList = new ArrayList<String>();
            char[] arrs = (char[]) obj;
            for (int i = 0; i < arrs.length; i++) {
                valueList.add(GetBaseTypeValue(arrs[i]));
            }
        } else if (obj instanceof short[]) {
            valueList = new ArrayList<String>();
            short[] arrs = (short[]) obj;
            for (int i = 0; i < arrs.length; i++) {
                valueList.add(GetBaseTypeValue(arrs[i]));
            }
        } else if (obj instanceof int[]) {
            valueList = new ArrayList<String>();
            int[] arrs = (int[]) obj;
            for (int i = 0; i < arrs.length; i++) {
                valueList.add(GetBaseTypeValue(arrs[i]));
            }
        } else if (obj instanceof long[]) {
            valueList = new ArrayList<String>();
            long[] arrs = (long[]) obj;
            for (int i = 0; i < arrs.length; i++) {
                valueList.add(GetBaseTypeValue(arrs[i]));
            }
        } else if (obj instanceof float[]) {
            valueList = new ArrayList<String>();
            float[] arrs = (float[]) obj;
            for (int i = 0; i < arrs.length; i++) {
                valueList.add(GetBaseTypeValue(arrs[i]));
            }
        } else if (obj instanceof double[]) {
            valueList = new ArrayList<String>();
            double[] arrs = (double[]) obj;
            for (int i = 0; i < arrs.length; i++) {
                valueList.add(GetBaseTypeValue(arrs[i]));
            }
        } else if (obj instanceof boolean[]) {
            valueList = new ArrayList<String>();
            boolean[] arrs = (boolean[]) obj;
            for (int i = 0; i < arrs.length; i++) {
                valueList.add(GetBaseTypeValue(arrs[i]));
            }
        } else if (obj instanceof Date[]) {
            valueList = new ArrayList<String>();
            Date[] arrs = (Date[]) obj;
            for (int i = 0; i < arrs.length; i++) {
                valueList.add(GetBaseTypeValue(arrs[i]));
            }
        } else if (obj instanceof String[]) {
            valueList = new ArrayList<String>();
            String[] arrs = (String[]) obj;
            for (int i = 0; i < arrs.length; i++) {
                valueList.add(GetBaseTypeValue(arrs[i]));
            }
        }
        if (valueList != null) {
            output = String.format("[%s]", String.join(",", valueList));
        } else {
            output = ToJsonByObject(obj);
        }

        return output;
    }

    private static String GetBaseTypeValue(Object obj) throws IOException {
        String value = null;

        if (obj instanceof Byte) {
            value = obj.toString();
        } else if (obj instanceof Character) {
            value = String.format("\"%s\"", obj.toString());
        } else if (obj instanceof Short) {
            value = obj.toString();
        } else if (obj instanceof Integer) {
            value = obj.toString();
        } else if (obj instanceof Long) {
            value = obj.toString();
        } else if (obj instanceof Float) {
            value = obj.toString();
        } else if (obj instanceof Double) {
            value = obj.toString();
        } else if (obj instanceof BigDecimal) {
            value = obj.toString();
        } else if (obj instanceof Boolean) {
            value = (boolean) obj ? "true" : "false";
        } else if (obj instanceof Date) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
            value = String.format("\"%s\"", sdf.format((Date) obj));
        } else if (obj instanceof String) {
            value = String.format("\"%s\"", Encode(obj.toString()));
        }

        return value;
    }

    private static String GetBaseTypeJson(Object obj) throws IOException, IllegalAccessException {
        String output = null;
        String value = GetBaseTypeValue(obj);

        if (value != null) {
            output = value;
        } else {
            output = ToJsonByObject(obj);
        }
        return output;
    }

    private static String Encode(String str) throws IOException {
        ByteArrayInputStream input = new ByteArrayInputStream(str.getBytes());
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        int iRead = 0;
        while ((iRead = input.read()) != -1) {
            char c = (char) iRead;
            if (c == '\\')
                output.write("\\\\".getBytes());
            else if (c == '"')
                output.write("\\\"".getBytes());
            else if (c == '\n')
                output.write("\\n".getBytes());
            else if (c == '\r')
                output.write("\\r".getBytes());
            else if (c == '\f')
                output.write("\\f".getBytes());
            else if (c == '\b')
                output.write("\\b".getBytes());
            else if (c == '\t')
                output.write("\\t".getBytes());
            else
                output.write(c);
        }

        return output.toString();
    }

    private static String ToJsonByArray(ArrayList arrayList) throws IOException, IllegalAccessException {
        List<String> itemList = new ArrayList<String>();

        for (int i = 0; i < arrayList.size(); i++) {
            itemList.add(GetOutpuStream(arrayList.get(i)));
        }

        return String.format("[%s]", String.join(",", itemList));
    }

    private static String ToJsonByMap(Map<String, Object> map) throws IOException, IllegalAccessException {
        List<String> itemList = new ArrayList<String>();
        String key = null;
        Object value = null;

        for (Map.Entry<String, Object> entry : map.entrySet()) {
            key = entry.getKey();
            value = entry.getValue();
            if (value == null) {
                itemList.add(String.format("\"%s\":null", Encode(key)));
            } else {
                itemList.add(String.format("\"%s\":%s", Encode(key), GetOutpuStream(value)));
            }
        }

        return String.format("{%s}", String.join(",", itemList));
    }

    private static String ToJsonByObject(Object obj) throws IOException, IllegalAccessException {
        if (obj.getClass().isArray()) {
            Object[] objList = (Object[]) obj;

            List<String> itemList = new ArrayList<String>();

            for (int i = 0; i < objList.length; i++) {
                itemList.add(GetOutpuStream(objList[i]));
            }

            return String.format("[%s]", String.join(",", itemList));
        }
        else if(obj.getClass().isPrimitive()) {
            return obj.toString();
        }
        else {
            Field[] fieldList = obj.getClass().getFields();
            String key = null;
            Object value = null;
            Field field = null;
            List<String> itemList = new ArrayList<String>();

            for (int i = 0; i < fieldList.length; i++) {
                field = fieldList[i];
                key = field.getName();
                value = field.get(obj);

                if (value == null) {
                    itemList.add(String.format("\"%s\":null", key));
                } else {
                    itemList.add(String.format("\"%s\":%s", key, GetOutpuStream(value)));
                }
            }

            return String.format("{%s}", String.join(",", itemList));
        }
    }

    public static <T> List<T> JsonToList(Class<T> cls,  String jsonString) throws IOException, Exception, InstantiationException, IllegalAccessException {
        ArrayList arrayList = JsonToArrayList(jsonString);
        if (arrayList != null && !arrayList.isEmpty()) {

            List<T> list = new ArrayList<T>();
            Object item = null;
            for (int i = 0; i < arrayList.size(); i++) {
                item = arrayList.get(i);
                if (item instanceof Map) {
                    list.add(MapTo(cls, (Map<String, Object>) item));
                }
            }

            return list;
        }

        return null;
    }

    public static <T> T JsonTo(Class<T> cls, String jsonString) throws IOException, Exception, InstantiationException, IllegalAccessException {
        Map<String, Object> map = JsonToDictionary(jsonString);
        return MapTo(cls, map);
    }

    public static ArrayList ArrayListTo(Class<?> cls, ArrayList arrayList) throws InstantiationException, IllegalAccessException, Exception {
        ArrayList list = new ArrayList();
        Object obj = null, item = null;
        for (int i = 0; i < arrayList.size(); i++) {
            item = arrayList.get(i);
            if (item instanceof Map) {
                obj = MapTo(cls, (Map<String, Object>) item);
            } else if (item instanceof ArrayList) {
                obj = ArrayListTo(cls, (ArrayList) item);
            } else {
                obj = Common.ChangeType(cls, item);
            }
            list.add(obj);
        }
        return list;
    }

    public static <T> T MapTo(Class<T> cls, Map<String, Object> map) throws InstantiationException, IllegalAccessException, Exception {
        if (map != null) {
            T obj = cls.newInstance();

            Field[] fieldList = obj.getClass().getFields();
            Field field = null;
            Object value = null;
            boolean blExists = false;
            Class<?> fieldType = null;

            for (int i = 0; i < fieldList.length; i++) {
                field = fieldList[i];
                blExists = false;
                for (Map.Entry<String, Object> kvp : map.entrySet()) {
                    if (kvp.getKey().toLowerCase().equals(field.getName().toLowerCase())) {
                        value = kvp.getValue();
                        blExists = true;
                        break;
                    }
                }
                if (blExists) {
                    if (value == null) {
                        field.set(obj, value);
                    } else if (value instanceof ArrayList) {
                        fieldType = field.getType();
                        if (fieldType.isArray()) {
                            field.set(obj, Common.ChangeArrayType(fieldType, (ArrayList) value));
                        } else {
                            ParameterizedType pt = (ParameterizedType) field.getGenericType();
                            field.set(obj, ArrayListTo((Class<?>) pt.getActualTypeArguments()[0], (ArrayList) value));
                        }
                    } else if (value instanceof Map) {
                        field.set(obj, MapTo(field.getType(), (Map<String, Object>) value));
                    } else {
                        field.set(obj, Common.ChangeType(field.getType(), value));
                    }
                }
            }
            return obj;
        }
        return null;
    }

    public static Map<String, Object> JsonToDictionary(String jsonString) throws IOException, Exception {
        ArrayList list = JsonToArrayList(jsonString);
        if (list != null && list.size() == 1 && list.get(0) instanceof Map) {
            return (Map<String, Object>) list.get(0);
        }
        return null;
    }

    public static List<Map<String, Object>> JsonToDictionaryList(String jsonString) throws IOException, Exception {
        return JsonToArrayList(jsonString);
    }

    public static ArrayList JsonToArrayList(String jsonString) throws IOException, Exception {
        ArrayList list = null;

        if (Common.IsNullOrEmpty(jsonString)) {
            return null;
        }

        //去前后空格与回车转义符
        jsonString = TrimWhiteEnter(jsonString);

        if (jsonString.equals("{}")) {
            list = new ArrayList(1);
            list.add(new HashMap<String, Object>());
            return list;
        }

        if (jsonString.equals("[]")) {
            return new ArrayList();
        }

        CheckJsonFormat(jsonString);

        //字符串属性名或值
        Map<String, String> strList = new HashMap<String, String>();
        jsonString = GetStringList(jsonString, strList);

        //Object字符串
        Map<String, String> objList = new HashMap<String, String>();

        int iCount = 0;
        int iCount2 = 0;
        do {
            iCount = iCount2;
            jsonString = GetObjectJsonStringList(jsonString, objList, false);
            iCount2 = objList.size();
        }
        while (iCount < iCount2);

        //数组字符串
        Map<String, String> arrayList = new HashMap<String, String>();
        jsonString = GetArrayStringList(arrayList, jsonString);

        //Object中的数组
        for (Map.Entry<String, String> kvp : objList.entrySet()) {
            kvp.setValue(GetArrayStringList(arrayList, kvp.getValue()));
        }

        if (!arrayList.isEmpty() || !objList.isEmpty()) {
            List<String> keyList = new ArrayList<String>(arrayList.keySet());
            keyList.addAll(objList.keySet());

            return GetArrayList(jsonString, keyList, arrayList, objList, strList);
        }

        return null;
    }

    private static String GetArrayStringList(Map<String, String> arrayList, String jsonString) throws IOException {
        int iCount = 0;
        int iCount2 = 0;
        do {
            iCount = iCount2;
            jsonString = GetObjectJsonStringList(jsonString, arrayList, true);
            iCount2 = arrayList.size();
        }
        while (iCount < iCount2);

        return jsonString;
    }

    private static ArrayList GetArrayList(String jsonString, List<String> keyList, Map<String, String> arrayList, Map<String, String> objList, Map<String, String> strList) throws Exception {
        String[] strArray = jsonString.split(",");

        if (keyList != null) {
            CheckKeyExists(strArray, keyList);
        }

        ArrayList list = new ArrayList();

        Object ele=null;
        for (int i = 0; i < strArray.length; i++) {
            ele = GetObjectValue(TrimWhiteEnter(strArray[i]), arrayList, objList, strList);
            if (ele != null) list.add(ele);
        }

        if (keyList != null && list.size() == 1 && list.get(0) instanceof ArrayList) {
            return (ArrayList) list.get(0);
        }
        return list;
    }

    private static Map<String, Object> GetDictionary(String jsonString, Map<String, String> arrayList, Map<String, String> objList, Map<String, String> strList) throws Exception {
        String[] strArray = jsonString.split(",");

        Map<String, Object> map = new HashMap<String, Object>();

        String[] kv = null;
        String str = "", key = "", value = "";
        String keyValue = "";

        for (int i = 0; i < strArray.length; i++) {
            str = strArray[i];
            kv = str.split(":");

            if (kv.length != 2) {
                throw new Exception(FormatMessage);
            }

            key = TrimWhiteEnter(kv[0]);
            value = TrimWhiteEnter(kv[1]);

            keyValue = strList.get(key);
            if (Common.IsNullOrEmpty(keyValue)) {
                keyValue = key;
            }

            map.put(keyValue, GetObjectValue(value, arrayList, objList, strList));
        }

        return map;
    }

    private static Object GetObjectValue(String value, Map<String, String> arrayList, Map<String, String> objList, Map<String, String> strList) throws Exception {
        Object objValue = null;
        String value2 = null;

        //字符串值
        if (value.startsWith("str") && value.length() == 35) {
            value2 = strList.get(value);
        }
        if (value2 != null) {
            objValue = value2;
        } else {
            //数组值
            if (value.startsWith("arr") && value.length() == 35) {
                value2 = arrayList.get(value);
            }
            if (value2 != null) {
                objValue = GetArrayList(value2, null, arrayList, objList, strList);
            } else {
                //Object值
                if (value.startsWith("obj") && value.length() == 35) {
                    value2 = objList.get(value);
                }
                if (value2 != null) {
                    //Object
                    objValue = GetDictionary(value2, arrayList, objList, strList);
                }
            }
        }
        if (value2 == null) {
            //boolean、int、double,null
            objValue = GetJsonValue(value);
        }

        return objValue;
    }

    private static Object GetJsonValue(String value) {
        if (Common.IsNullOrEmpty(value) || value.toLowerCase().equals("null")) {
            return null;
        }
        if (value.toLowerCase().equals("true")) {
            return true;
        }
        if (value.toLowerCase().equals("false")) {
            return false;
        }

        if (Common.CheckDouble(value)) {
            return Double.parseDouble(value);
        }

        if (Common.CheckNumber(value)) {
            long lv = Long.parseLong(value);
            if (lv <= Integer.MAX_VALUE && lv >= Integer.MIN_VALUE) {
                return (int) lv;
            }
            return lv;
        }

        return value;
    }

    private static void CheckKeyExists(String[] strArray, List<String> keyList) throws Exception {
        for (int i = 0; i < strArray.length; i++) {
            if (!keyList.contains(strArray[i])) {
                throw new Exception(FormatMessage);
            }
        }
    }

    private static String TrimWhiteEnter(String str) {
        str = Common.Trim(str);
        return Common.TrimEnter(str);
    }

    private static void CheckJsonFormat(String jsonString) throws Exception {
        boolean blSuccess = true;

        if (!jsonString.startsWith("{") && !jsonString.startsWith("[") && !jsonString.endsWith("}") && !jsonString.endsWith("]")) {
            blSuccess = false;
        }
        if (blSuccess && jsonString.startsWith("{") && !jsonString.endsWith("}")) {
            blSuccess = false;
        }
        if (blSuccess && jsonString.startsWith("[") && !jsonString.endsWith("]")) {
            blSuccess = false;
        }

        if (!blSuccess) {
            throw new Exception(FormatMessage);
        }
    }

    private static String GetStringList(String jsonString, Map<String, String> strList) throws IOException {
        ByteArrayInputStream input = new ByteArrayInputStream(jsonString.getBytes());
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ByteArrayOutputStream output2 = null;

        char c = '\0';
        char preChar = '\0';
        int iRead = 0;
        int index = 0;
        boolean blStart = false;
        boolean blStart2 = false;
        String keyValue = "", value = "";

        while ((iRead = input.read()) != -1) {
            c = (char) iRead;

            if (!blStart) {
                blStart = preChar != '\\' && c == '"';
                if (blStart) {
                    blStart2 = true;
                }
            }

            if (blStart) {
                if (blStart2) {
                    output2 = new ByteArrayOutputStream();
                }
            } else {
                output.write(c);
            }

            if (output2 != null) {
                output2.write(c);
            }

            if (blStart && !blStart2 && preChar != '\\' && c == '"') {
                blStart = false;
                keyValue = String.format("str%s", Common.CreateGuid().replace("-", ""));
                output.write(keyValue.getBytes());
                value = output2.toString();
                strList.put(keyValue, value.substring(1, value.length() - 1));
                output2 = null;
            }
            preChar = c;
            blStart2 = false;
        }
        return output.toString();
    }

    private static String GetObjectJsonStringList(String jsonString, Map<String, String> objList, boolean blArray) throws IOException {
        ByteArrayInputStream input = new ByteArrayInputStream(jsonString.getBytes());

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ByteArrayOutputStream output2 = null;

        char c = '\0';
        int iRead = 0;
        String keyValue = "", value = "";
        char sc = blArray ? '[' : '{';
        char ec = blArray ? ']' : '}';

        while ((iRead = input.read()) != -1) {
            c = (char) iRead;

            if (c == sc) {
                if (output2 != null) {
                    output.write(output2.toByteArray());
                }
                output2 = new ByteArrayOutputStream();
            }

            if (output2 != null) {
                output2.write(c);
            } else {
                output.write(c);
            }

            if (output2 != null && c == ec) {
                keyValue = String.format("%s%s", blArray ? "arr" : "obj", Common.CreateGuid().replace("-", ""));
                output.write(keyValue.getBytes());
                value = output2.toString();
                objList.put(keyValue, value.substring(1, value.length() - 1));
                output2 = null;
            }
        }

        return output.toString();
    }
}
