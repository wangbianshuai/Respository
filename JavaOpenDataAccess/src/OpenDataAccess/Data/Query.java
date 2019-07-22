package OpenDataAccess.Data;

import java.util.List;

public class Query implements IQuery {
    public String GetTableName() {
        return _TableName;
    }

    public void SetTableName(String value) {
        _TableName = value;
    }

    public String GetWithSql() {
        return _WithSql;
    }

    public void SetWithSql(String value) {
        _WithSql = value;
    }

    public String GetEntityName() {
        return _EntityName;
    }

    public void SetEntityName(String value) {
        _EntityName = value;
    }

    public IDataParameterList GetParameterList() {
        return _ParameterList2;
    }

    public void SetParameterList(IDataParameterList value) {
        _ParameterList2 = value;
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
    private IDataParameterList _ParameterList = null;
    private IDataParameterList _ParameterList2 = null;

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

    public IQuery Where(String whereSql, IDataParameterList parameterList) {
        _WhereSql = " ".concat(whereSql).concat(" ");
        _ParameterList = parameterList;
        return this;
    }

    public IQuery Where(List<WhereStatement> whereList, IDataParameterList parameterList) {
        _WhereSql = Common.GetWhereStatement(whereList);
        _ParameterList = parameterList;
        return this;
    }

    public IQuery Select(String fieldSql) {
        _FieldSql = " ".concat(OpenDataAccess.Utility.Common.IsNullOrEmpty(fieldSql) ? "*" : fieldSql).concat(" ");
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

    public IQuery SetSql(String sqlText, IDataParameterList parameterList) {
        _Sql = sqlText;
        if (parameterList != null) {
            _ParameterList = parameterList;
        }
        return this;
    }

    public String ToSql() {
        String sqlText = "";
        if (OpenDataAccess.Utility.Common.IsNullOrEmpty(_Sql)) {
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
