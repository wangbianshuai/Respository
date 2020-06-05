using System.Collections.Generic;
using System.Data;

namespace OpenDataAccessCore.Data
{
    public class Query : IQuery
    {
        public string EntityName { get; set; }
        public string TableName { get; set; }
        public string WithSql { get; set; }
        private string _JoinSql = string.Empty;
        private string _WhereSql = string.Empty;
        private string _OrderBySql = string.Empty;
        private string _GroupBySql = string.Empty;
        private string _FieldSql = "*";
        private string _Sql = string.Empty;
        private List<IDbDataParameter> _ParameterList = null;
        public List<IDbDataParameter> ParameterList { get; set; }

        public Query(string tableName)
        {
            this.TableName = tableName;
        }

        public Query(string tableName, string entityName)
        {
            this.TableName = tableName;
            this.EntityName = entityName;
        }

        public IQuery Join(List<JoinStatement> joinList)
        {
            _JoinSql = Common.GetJoinStatement(joinList);
            return this;
        }

        public IQuery Join(string joinSql)
        {
            _JoinSql = string.Concat(" ", joinSql, " "); ;
            return this;
        }

        public IQuery Where(string whereSql, List<IDbDataParameter> parameterList = null)
        {
            _WhereSql = string.Concat(" ", whereSql, " ");
            _ParameterList = parameterList;
            return this;
        }
        public IQuery Where(List<WhereStatement> whereList, List<IDbDataParameter> parameterList = null)
        {
            _WhereSql = Common.GetWhereStatement(whereList);
            _ParameterList = parameterList;
            return this;
        }

        public IQuery Select(string fieldSql)
        {
            _FieldSql = string.Concat(" ", string.IsNullOrEmpty(fieldSql) ? "*" : fieldSql, " ");
            return this;
        }

        public IQuery Select(List<string> fieldList)
        {
            _FieldSql = string.Concat(" ", Common.GetFields(fieldList), " ");
            return this;
        }

        public IQuery OrderBy(string orderBySql)
        {
            _OrderBySql = string.Concat(" ", orderBySql, " ");
            return this;
        }

        public IQuery OrderBy(List<OrderByStatement> orderByList)
        {
            _OrderBySql = string.Concat(" ", Common.GetOrderByStatement(orderByList), " ");
            return this;
        }

        public IQuery GroupBy(List<string> groupByList)
        {
            _GroupBySql = string.Concat(" ", Common.GetGroupByFields(groupByList), " ");
            return this;
        }

        public IQuery GroupBy(string groupBySql)
        {
            _GroupBySql = string.Concat(" ", groupBySql, " ");
            return this;
        }

        public IQuery SetSql(string sqlText, List<IDbDataParameter> parameterList = null)
        {
            _Sql = sqlText;
            if (parameterList != null)
            {
                _ParameterList = parameterList;
            }
            return this;
        }

        public string ToSql()
        {
            if (TableName.StartsWith("(") && TableName.EndsWith(")")) TableName += " t";
            
            string sqlText = string.Empty;
            if (string.IsNullOrEmpty(_Sql))
            {
                sqlText = string.Concat("select ", _FieldSql, " from ", TableName, _JoinSql, _WhereSql, _GroupBySql, _OrderBySql);
            }
            else
            {
                sqlText = _Sql;
            }
            if (!string.IsNullOrEmpty(WithSql)) sqlText = WithSql + " " + sqlText;
            ParameterList = _ParameterList;
            _FieldSql = "*";
            _GroupBySql = string.Empty;
            _JoinSql = string.Empty;
            _OrderBySql = string.Empty;
            _WhereSql = string.Empty;
            _ParameterList = null;
            _Sql = string.Empty;
            return sqlText;
        }

        public string ToWhereSql()
        {
            ParameterList = _ParameterList;
            return _WhereSql;
        }

        public string ToGroupSql()
        {
            return _GroupBySql;
        }

        public string ToSelectSql()
        {
            return _FieldSql;
        }

        public string ToOrderBySql()
        {
            return _OrderBySql;
        }
    }
}
