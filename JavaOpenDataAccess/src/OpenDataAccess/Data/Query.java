package OpenDataAccess.Data;

import java.util.List;

public class Query implements IQuery {
    public String EntityName(String value, boolean blGet) {
        if (!blGet) _EntityName = value;
        return _EntityName;
    }

    public String TableName(String value, boolean blGet) {
        if (!blGet) _TableName = value;
        return _TableName;
    }

    public String WithSql(String value, boolean blGet) {
        if (!blGet) _WithSql = value;
        return _WithSql;
    }

    private String _WithSql = "";
    private String _TableName = "";
    private String _EntityName = "";
    private String _JoinSql = "";
    private String _WhereSql = "";
    private String _OrderBySql = "";
    private String _GroupBySql = "";
    private String _FieldSql = "*";
    private String _Sql = "";
    private List<IDataParameterList> _ParameterList = null;
    private List<IDataParameterList> _ParameterList2 = null;

    public List<IDataParameterList> ParameterList(List<IDataParameterList> value, boolean blGet) {
        if (!blGet) _ParameterList2 = value;
        return _ParameterList2;
    }

    public Query(String tableName) {
        this._TableName = tableName;
    }

    public Query(String tableName, String entityName) {
        this._TableName = tableName;
        this._EntityName = entityName;
    }

    public IQuery Join(List<JoinStatement> joinList) {
        _JoinSql = Common.GetJoinStatement(joinList);
        return this;
    }

    public IQuery Join(String joinSql) {
        _JoinSql = joinSql;
        return this;
    }

    public IQuery Where(String whereSql, List<IDataParameterList> parameterList) {
        _WhereSql = " ".concat(whereSql).concat(" ");
        _ParameterList = parameterList;
        return this;
    }

    public IQuery Where(List<WhereStatement> whereList, List<IDataParameterList> parameterList) {
        _WhereSql = Common.GetWhereStatement(whereList);
        _ParameterList = parameterList;
        return this;
    }

    public IQuery Select(String fieldSql) {
        _FieldSql = " ".concat(OpenDataAccess.Utility.Common.StringIsNullOrEmpty(fieldSql) ? "*" : fieldSql).concat(" ");
        return this;
    }

    public IQuery Select(List<String> fieldList) {
        _FieldSql = " ".concat(Common.GetFields(fieldList)).concat(" ");
        return this;
    }

    public IQuery OrderBy(String orderBySql) {
        _OrderBySql = " ".concat(orderBySql).concat(" ");
        return this;
    }

    public IQuery OrderBy(List<OrderByStatement> orderByList) {
        _OrderBySql = " ".concat(Common.GetOrderByStatement(orderByList)).concat(" ");
        return this;
    }

    public IQuery GroupBy(List<String> groupByList) {
        _GroupBySql = " ".concat(Common.GetGroupByFields(groupByList)).concat(" ");
        return this;
    }

    public IQuery GroupBy(String groupBySql) {
        _GroupBySql = " ".concat(groupBySql).concat(" ");
        return this;
    }

    public IQuery SetSql(String sqlText, List<IDataParameterList> parameterList) {
        _Sql = sqlText;
        if (parameterList != null) {
            _ParameterList = parameterList;
        }
        return this;
    }

    public String ToSql() {
        String sqlText = "";
        if (OpenDataAccess.Utility.Common.StringIsNullOrEmpty(_Sql)) {
            sqlText = String.format("%%%%%%%%", "select ", _FieldSql, " from ", _TableName, _JoinSql, _WhereSql, _GroupBySql, _OrderBySql);
        } else {
            sqlText = _Sql;
        }
        _ParameterList2 = _ParameterList;
        _FieldSql = "*";
        _GroupBySql = "";
        _JoinSql = "";
        _OrderBySql = "";
        _WhereSql = "";
        _ParameterList = null;
        _Sql = "";
        return sqlText;
    }

    public String ToWhereSql() {
        _ParameterList2 = _ParameterList;
        return _WhereSql;
    }

    public String ToGroupSql() {
        return _GroupBySql;
    }

    public String ToSelectSql() {
        return _FieldSql;
    }

    public String ToOrderBySql() {
        return _OrderBySql;
    }
}
