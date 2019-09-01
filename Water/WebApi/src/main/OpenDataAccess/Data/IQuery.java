package OpenDataAccess.Data;

import java.util.List;

public interface IQuery {
    String GetTableName();
    void  SetTableName(String value);

    String GetWithSql();
    void  SetWithSql(String value);

    String GetEntityName();
    void  SetEntityName(String value);

    IDataParameterList GetParameterList();
    void SetParameterList(IDataParameterList value);

    IQuery Join(List<JoinStatement> joinList);

    IQuery Join(String jionSql);

    IQuery Where(String whereSql, IDataParameterList parameterList);

    IQuery Where(List<WhereStatement> whereList, IDataParameterList parameterList);

    IQuery Select(String fieldSql);

    IQuery Select(List<String> fieldList);

    IQuery OrderBy(String orderBySql);

    IQuery OrderBy(List<OrderByStatement> orderByList);

    IQuery GroupBy(List<String> groupByList);

    IQuery GroupBy(String groupBySql);

    IQuery SetSql(String sqlText, IDataParameterList parameterList);

    String ToSql();

    String ToWhereSql();

    String ToGroupSql();

    String ToSelectSql();

    String ToOrderBySql();
}