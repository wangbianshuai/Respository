package Utility;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Bianshuai on 2017/1/9.
 */
public class Common {

    public static String InputStream2String(InputStream inputStream) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
        StringBuffer sb = new StringBuffer();
        String line = "";
        while ((line = br.readLine()) != null) {
            sb.append(line);
        }
        return sb.toString();
    }

    public static boolean StringIsNullOrEmpty(String str) {
        return str == null || StringTrim(str).isEmpty();
    }

    public static String StringTrim(String str) {
        if (str == null || str.isEmpty()) {
            return "";
        }

        str = StringReplace(str, "(^\\s*)|(\\s*$)", "");
        str = StringReplace(str, "(^　*)|(　*$)", "");

        return str.trim();
    }

    public static String RemoveWhiteSpaceEnter(String str) {
        return str.replaceAll(" ", "").replaceAll("　", "").replace("\n", "").replace("\r", "");
    }

    public static String StringTrimEnter(String str) {
        str = StringReplace(str, "(^\ns*)|(\ns*$)", "");
        return StringReplace(str, "(^\rs*)|(\rs*$)", "");
    }

    public static String StringReplace(String str, String reg, String rpValue) {
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

    public static Object ChangeType(Class<?> type, Object value) throws Exception {
        if(value==null) return null;
        if (type.equals(byte.class)) {
            return value instanceof Byte ? value : Byte.parseByte(value.toString());
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
            return value instanceof Boolean ? value : Boolean.parseBoolean(value.toString());
        } else if (type.equals(Date.class)) {
            if (value instanceof Date) {
                return value;
            } else {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                return sdf.parse(GetDateString(value.toString()));
            }
        } else if (type.equals(String.class)) {
            return value instanceof String ? value : value.toString();
        }
        return value;
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
        return null;
    }

    public static String DateToString(Date date, String pattern) {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        return sdf.format(date);
    }

    public static Throwable GetRealException(Throwable ex) {
        Throwable throwable = ex.getCause();
        if (throwable != null) {
            return GetRealException(throwable);
        }
        return ex;
    }
}