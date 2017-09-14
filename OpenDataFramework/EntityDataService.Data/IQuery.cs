using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using EntityDataService.Data;

namespace EntityDataService.Data
{
    public interface IQuery
    {
        string TableName { get; set; }
        string EntityName { get; set; }
        List<IDbDataParameter> ParameterList { get; set; }
        IQuery Join(List<JoinStatement> joinList);
        IQuery Join(string jionSql);
        IQuery Where(string whereSql, List<IDbDataParameter> parameterList = null);
        IQuery Where(List<WhereStatement> whereList, List<IDbDataParameter> parameterList = null);
        IQuery Select(string fieldSql);
        IQuery Select(List<string> fieldList);
        IQuery OrderBy(string orderBySql);
        IQuery OrderBy(List<OrderByStatement> orderByList);
        IQuery GroupBy(List<string> groupByList);
        IQuery GroupBy(string groupBySql);
        IQuery SetSql(string sqlText, List<IDbDataParameter> parameterList = null);
        string ToSql();
        string ToWhereSql();
        string ToGroupSql();
        string ToSelectSql();
        string ToOrderBySql();
    }
}
