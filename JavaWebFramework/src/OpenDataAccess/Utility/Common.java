package OpenDataAccess.Utility;

import jdk.nashorn.internal.runtime.options.Option;

import java.io.*;
import java.sql.NClob;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

/**
 * Created by Bianshuai on 2017/1/9.
 */
public class Common {

    public static String InputStream2String(InputStream inputStream) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(inputStream,"utf-8"));
        StringBuffer sb = new StringBuffer();
        String line = "";
        while ((line = br.readLine()) != null) {
            sb.append(line);
        }
        return sb.toString();
    }

    public static boolean IsEquals(Object v1, Object v2, boolean blIgnoreCase) {
        if ((v1 == null && v2 != null) || (v1 != null && v2 == null)) return false;

        if (v1.getClass().equals(v2.getClass()) && v1.equals(v2)) return true;

        String s1 = v1.toString();
        String s2 = v2.toString();

        if (s1.equals(v2)) return true;

        if (blIgnoreCase && s1.toLowerCase().equals(s2.toLowerCase())) return true;

        return false;
    }

    public static <T> T GetFirstOrDefault(Class<T> cls, Collection<T> collection, Predicate<T> predicate) {
        Optional<T> optional = collection.stream().filter(f -> predicate.test(f)).findFirst();
        return optional.isPresent() ? optional.get() : (T) GetTypeDefaultValue(cls);
    }

    public static boolean IsNullOrEmpty(String str) {
        return str == null || Trim(str).isEmpty();
    }

    public static String Trim(String str) {
        if (str == null || str.isEmpty()) {
            return "";
        }

        str = Replace(str, "(^\\s*)|(\\s*$)", "");
        str = Replace(str, "(^　*)|(　*$)", "");

        return str.trim();
    }

    public static String RemoveWhiteSpaceEnter(String str) {
        return str.replaceAll(" ", "").replaceAll("　", "").replace("\n", "").replace("\r", "");
    }

    public static String TrimEnter(String str) {
        str = Replace(str, "(^\ns*)|(\ns*$)", "");
        return Replace(str, "(^\rs*)|(\rs*$)", "");
    }

    public static String Replace(String str, String reg, String rpValue) {
        Pattern pn = Pattern.compile(reg);
        Matcher mr = pn.matcher(str);
        return mr.replaceAll(rpValue);
    }

    public static String CreateGuid() {
        return UUID.randomUUID().toString();
    }

    public static boolean CheckDouble(String value) {
        String regex = "^[-+]?(/d+(/./d*)?|(/./d+))([eE]([-+]?([012]?/d{1,2}|30[0-7])|-3([01]?[4-9]|[012]?[0-3])))?[dD]?$";
        return value.matches(regex);
    }

    public static boolean CheckNumber(String value) {
        String regex = "^(-?[1-9]\\d*)$";
        return value.matches(regex);
    }

    public static <T> T ConvertValue(Class<T> cls, Object value) throws Exception {
        if (value != null && value.getClass().equals((cls))) return (T) value;
        else {
            value = Common.ChangeType(cls, value);
            if (value != null) return (T) value;
            return (T) Common.GetTypeDefaultValue(cls);
        }
    }

    public static Object ChangeType(Class<?> type, Object value) throws Exception {
        if (value == null) return null;
        if (type.equals(byte.class)) {
            if (value instanceof Byte) return value;
            String s = value.toString().toLowerCase();
            if (s.equals("true")) return (byte) 1;
            else if (s.equals(("false"))) return (byte) 0;
            return Byte.parseByte(value.toString());
        } else if (type.equals(char.class)) {
            if (value instanceof Character) {
                return value;
            } else {
                char[] cs = value.toString().toCharArray();
                if (cs.length == 0) {
                    return '\0';
                } else if (cs.length == 1) {
                    return cs[0];
                } else {
                    throw new Exception("String转char长度不正确！");
                }
            }
        } else if (type.equals(short.class)) {
            return value instanceof Short ? value : Short.parseShort(value.toString());
        } else if (type.equals(int.class)) {
            return value instanceof Integer ? value : Integer.parseInt(value.toString());
        } else if (type.equals(long.class)) {
            return value instanceof Long ? value : Long.parseLong(value.toString());
        } else if (type.equals(float.class)) {
            return value instanceof Float ? value : Float.parseFloat(value.toString());
        } else if (type.equals(double.class)) {
            return value instanceof Double ? value : Double.parseDouble(value.toString());
        } else if (type.equals(boolean.class)) {
            if (value instanceof Boolean) return value;
            String s = value.toString();
            if (s.equals("1")) return true;
            else if (s.equals("0")) return false;
            return Boolean.parseBoolean(s);
        } else if (type.equals(Date.class)) {
            if (value instanceof Date) {
                return value;
            } else {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                return sdf.parse(GetDateString(value.toString()));
            }
        } else if (type.equals(String.class)) {
            if(value instanceof  NClob) return  Clob2String((NClob)value);
            return value instanceof String ? value : value.toString();
        }
        else if (type.equals(NClob.class)) {
            return Clob2String((NClob) value);
        }
        return value;
    }

    public static String Clob2String(NClob nclob) throws Exception {
        String content = "";

        Reader is = nclob.getCharacterStream();
        BufferedReader buff = new BufferedReader(is);// 得到流
        String line = buff.readLine();
        StringBuffer sb = new StringBuffer();
        while (line != null) {// 执行循环将字符串全部取出付值给StringBuffer由StringBuffer转成STRING
            sb.append(line);
            line = buff.readLine();
        }
        content = sb.toString();

        return content;
    }

    public static <T> Object GetTypeDefaultValue(Class<T> type) {
        if (type.equals(byte.class)) {
            return 0;
        } else if (type.equals(char.class)) {
            return '\0';
        } else if (type.equals(short.class)) {
            return 0;
        } else if (type.equals(int.class)) {
            return 0;
        } else if (type.equals(long.class)) {
            return 0;
        } else if (type.equals(float.class)) {
            return 0;
        } else if (type.equals(double.class)) {
            return 0;
        } else if (type.equals(boolean.class)) {
            return false;
        } else if (type.equals(Date.class)) {
            return new Date(0);
        } else if (type.equals(String.class)) {
            return null;
        }
        return null;
    }

    public static Object ChangeArrayType(Class<?> type, ArrayList list) throws Exception {
        if (type.equals(byte[].class)) {
            byte[] newList = new byte[list.size()];
            for (int i = 0; i < list.size(); i++) {
                newList[i] = (byte) ChangeType(byte.class, list.get(i));
            }
            return newList;
        } else if (type.equals(char[].class)) {
            char[] newList = new char[list.size()];
            for (int i = 0; i < list.size(); i++) {
                newList[i] = (char) ChangeType(char.class, list.get(i));
            }
            return newList;
        } else if (type.equals(short[].class)) {
            short[] newList = new short[list.size()];
            for (int i = 0; i < list.size(); i++) {
                newList[i] = (short) ChangeType(short.class, list.get(i));
            }
            return newList;
        } else if (type.equals(int[].class)) {
            int[] newList = new int[list.size()];
            for (int i = 0; i < list.size(); i++) {
                newList[i] = (int) ChangeType(int.class, list.get(i));
            }
            return newList;
        } else if (type.equals(long[].class)) {
            long[] newList = new long[list.size()];
            for (int i = 0; i < list.size(); i++) {
                newList[i] = (long) ChangeType(long.class, list.get(i));
            }
            return newList;
        } else if (type.equals(float[].class)) {
            float[] newList = new float[list.size()];
            for (int i = 0; i < list.size(); i++) {
                newList[i] = (float) ChangeType(float.class, list.get(i));
            }
            return newList;
        } else if (type.equals(double[].class)) {
            double[] newList = new double[list.size()];
            for (int i = 0; i < list.size(); i++) {
                newList[i] = (double) ChangeType(double.class, list.get(i));
            }
            return newList;
        } else if (type.equals(boolean[].class)) {
            boolean[] newList = new boolean[list.size()];
            for (int i = 0; i < list.size(); i++) {
                newList[i] = (boolean) ChangeType(boolean.class, list.get(i));
            }
            return newList;
        } else if (type.equals(Date[].class)) {
            Date[] newList = new Date[list.size()];
            for (int i = 0; i < list.size(); i++) {
                newList[i] = (Date) ChangeType(Date.class, list.get(i));
            }
            return newList;
        } else if (type.equals(String[].class)) {
            String[] newList = new String[list.size()];
            for (int i = 0; i < list.size(); i++) {
                newList[i] = (String) ChangeType(String.class, list.get(i));
            }
            return newList;
        }
        return list.toArray();
    }

    private static String GetDateString(String dateString) {
        int len = dateString.length();
        if (len >= 10) {
            String yyyy = dateString.substring(0, 4);
            String MM = dateString.substring(5, 7);
            String dd = dateString.substring(8, 10);

            String HH = "00", mm = "00", ss = "00", SSS = "000";
            if (len >= 16) {
                HH = dateString.substring(11, 13);
                mm = dateString.substring(14, 16);
                if (len >= 19) {
                    ss = dateString.substring(17, 19);
                    if (len == 23) {
                        SSS = dateString.substring(20, 23);
                    }
                }
            }

            dateString = String.format("%s-%s-%s %s:%s:%s.%s", yyyy, MM, dd, HH, mm, ss, SSS);
        }
        return dateString;
    }

    public static <T> T GetFirstOrDefault(Class<T> cls, List<T> list) {
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return (T) GetTypeDefaultValue(cls);
    }

    public static <T> T GetFirstOrDefault(Class<T> cls, List<T> list, Predicate<T> predicate) {
        if (list == null || list.isEmpty()) return (T) GetTypeDefaultValue(cls);

        int count = list.size();
        for (int i = 0; i < count; i++) {
            if (predicate.test(list.get(i))) return list.get(i);
        }
        return (T) GetTypeDefaultValue(cls);
    }

    public static <T> T ArrayFirst(Class<T> cls, Object list, Predicate<T> predicate) {
        if (list == null) return (T) GetTypeDefaultValue(cls);
        T[] array = (T[]) list;

        for (int i = 0; i < array.length; i++) {
            if (predicate.test(array[i])) return array[i];
        }
        return (T) GetTypeDefaultValue(cls);
    }

    public static <T> boolean Exists(List<T> list, Predicate<T> predicate) {
        if (list == null || list.isEmpty()) return false;

        int count = list.size();
        for (int i = 0; i < count; i++) {
            if (predicate.test(list.get(i))) return true;
        }
        return false;
    }

    public static String DateToString(Date date, String pattern) {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        return sdf.format(date);
    }

    public static String GetNow() {
        return DateToString(new Date(), "yyyy-MM-dd HH:mm:ss:SSS");
    }

    public static Date AddDays(Date date, long day) throws ParseException {
        long time = date.getTime(); // 得到指定日期的毫秒数
        day = day * 24 * 60 * 60 * 1000; // 要加上的天数转换成毫秒数
        time += day; // 相加得到新的毫秒数
        return new Date(time); // 将毫秒数转换成日期
    }

    public static Throwable GetRealException(Throwable ex) {
        Throwable throwable = ex.getCause();
        if (throwable != null) {
            return GetRealException(throwable);
        }
        return ex;
    }

    public static String TrimEnd(String str, String endStr) {
        if (IsNullOrEmpty(str) || IsNullOrEmpty(endStr)) return str;

        if (str.length() < endStr.length()) return str;

        int len = str.length() - endStr.length();
        String str2 = str.substring(0, len);
        String str3 = str.substring(len);

        if (str3.equals(endStr)) return str2;

        return str;
    }

    public static String TrimStart(String str, String startStr) {
        if (IsNullOrEmpty(str) || IsNullOrEmpty(startStr)) return str;

        if (str.length() < startStr.length()) return str;

        int len = startStr.length();
        String str2 = str.substring(len);
        String str3 = str.substring(0, len);

        if (str3.equals(startStr)) return str2;

        return str;
    }
}