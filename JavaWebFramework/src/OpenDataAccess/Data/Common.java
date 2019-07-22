package OpenDataAccess.Data;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class Common {

    //获取OrderBy语句
    public static String GetOrderByStatement(List<OrderByStatement> orderByList) {
        if (orderByList != null) {
            List<String> list = new ArrayList<String>();
            orderByList.forEach(orderBy ->
            {
                list.add(String.format("%ss %ss", orderBy.ColumnName, orderBy.IsASC ? "asc" : "desc"));
            });
            String orderBySql = String.join(",", list);
            if (!orderBySql.isEmpty()) {
                return " order by ".concat(orderBySql).concat(" ");
            }
        }
        return "";
    }

    /// 获取Where语句
    public static String GetWhereStatement(List<WhereStatement> whereList) {
        if (whereList != null) {
            List<String> list = new ArrayList<String>();
            whereList.forEach(where ->
            {
                list.add(String.format(" %s %s %s", where.ColumnName, where.LogicalOperator, where.ColumnValue));
            });
            String whereSql = String.join("", list);
            if (!whereSql.isEmpty()) {
                return " where ".concat(whereSql).concat(" ");
            }
        }
        return "";
    }

    /// 获取Join语句
    public static String GetJoinStatement(List<JoinStatement> joinlist) {
        if (joinlist != null) {
            List<String> list = new ArrayList<>();
            joinlist.forEach(join ->
            {
                list.add(String.format(" %s join %s on %s", join.JoinType, join.JoinTable, join.RelationOn));
            });
            return String.join("").concat(" ");
        }
        return "";
    }

    /// 获取字段集合
    public static String GetFields(List<String> fieldList) {
        if (fieldList != null && fieldList.stream().count() > 0) {
            return String.join(",", fieldList.stream().distinct().collect(Collectors.toList()));
        } else return "*";
    }

    /// 获取GroupBy语句
    public static String GetGroupByFields(List<String> groupByFieldList) {
        if (groupByFieldList != null && groupByFieldList.stream().count() > 0) {
            return " group by " + String.join(",", groupByFieldList.stream().distinct().collect(Collectors.toList()));
        } else return "";
    }

    public static Object ChangeType(Class<?> type, Object value) throws Exception {
        if (value == null) return null;
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

            dateString = String.format("%ss-%ss-%ss %ss:%ss:%ss.%ss", yyyy, MM, dd, HH, mm, ss, SSS);
        }
        return dateString;
    }
}





