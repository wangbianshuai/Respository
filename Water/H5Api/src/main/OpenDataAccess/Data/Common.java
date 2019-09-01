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
                list.add(String.format("%s %s", orderBy.ColumnName, orderBy.IsASC ? "asc" : "desc"));
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
}





