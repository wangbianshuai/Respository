package OpenDataAccess.Data;

import java.util.List;

public interface IQuery {
    String TableName(String value, boolean blGet);

    String WithSql(String value, boolean blGet);

    String EntityName(String value, boolean blGet);

    List<IDataParameterList> ParameterList(List<IDataParameterList> value, boolean blGet);

    IQuery Join(List<JoinStatement> joinList);

    IQuery Join(String jionSql);

    IQuery Where(String whereSql, List<IDataParameterList> parameterList);

    IQuery Where(List<WhereStatement> whereList, List<IDataParameterList> parameterList);

    IQuery Select(String fieldSql);

    IQuery Select(List<String> fieldList);

    IQuery OrderBy(String orderBySql);

    IQuery OrderBy(List<OrderByStatement> orderByList);

    IQuery GroupBy(List<String> groupByList);

    IQuery GroupBy(String groupBySql);

    IQuery SetSql(String sqlText, List<IDataParameterList> parameterList);

    String ToSql();

    String ToWhereSql();

    String ToGroupSql();

    String ToSelectSql();

    String ToOrderBySql();
}