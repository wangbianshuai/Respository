using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataAccess.Data
{
    public class Common
    {
        /// <summary>
        /// 获取OrderBy语句
        /// </summary>
        /// <param name="orderList"></param>
        /// <returns></returns>
        public static string GetOrderByStatement(List<OrderByStatement> orderByList)
        {
            if (orderByList != null)
            {
                StringBuilder sb = new StringBuilder();
                orderByList.ForEach(orderBy =>
                {
                    sb.AppendFormat(" {0} {1},", orderBy.ColumnName, orderBy.IsASC ? "asc" : "desc");
                });
                string orderBySql = sb.ToString().TrimEnd(',');
                if (!string.IsNullOrEmpty(orderBySql))
                {
                    return string.Concat(" order by ", orderBySql, " ");
                }
            }
            return string.Empty;
        }

        /// <summary>
        /// 获取Where语句
        /// </summary>
        /// <param name="whereList"></param>
        /// <returns></returns>
        public static string GetWhereStatement(List<WhereStatement> whereList)
        {
            if (whereList != null)
            {
                StringBuilder sb = new StringBuilder();
                whereList.ForEach(where =>
                {
                    sb.AppendFormat(" {0} {1} {2}", where.ColumnName, where.LogicalOperator, where.ColumnValue);
                });
                string whereSql = sb.ToString();
                if (!string.IsNullOrEmpty(whereSql))
                {
                    return string.Concat(" where ", whereSql, " ");
                }
            }
            return string.Empty;
        }

        /// <summary>
        /// 获取操作Where语句
        /// </summary>
        /// <param name="whereList"></param>
        /// <returns></returns>
        public static string GetOperateWhereStatement(List<OperateWhereStatement> whereList)
        {
            if (whereList != null)
            {
                StringBuilder sb = new StringBuilder();
                whereList.ForEach(where =>
                {
                    sb.AppendFormat(" {0} {1} {2}", where.ColumnName, where.LogicalOperator, where.ColumnValue);
                });
                string whereSql = sb.ToString();
                if (!string.IsNullOrEmpty(whereSql))
                {
                    return string.Concat(" where ", whereSql, " ");
                }
            }
            return string.Empty;
        }
        /// <summary>
        /// 获取Join语句
        /// </summary>
        /// <param name="joinlist"></param>
        /// <returns></returns>
        public static string GetJoinStatement(List<JoinStatement> joinlist)
        {
            if (joinlist != null)
            {
                StringBuilder sb = new StringBuilder();
                joinlist.ForEach(join =>
                {
                    sb.AppendFormat(" {0} join {1} on {2}", join.JoinType, join.JoinTable, join.RelationOn);
                });
                return sb.ToString() + " ";
            }
            return string.Empty;
        }
        /// <summary>
        /// 获取字段集合
        /// </summary>
        /// <param name="fieldList"></param>
        /// <returns></returns>
        public static string GetFields(List<string> fieldList)
        {
            if (fieldList != null && fieldList.Count > 0)
            {
                return string.Join(",", fieldList.Distinct().ToArray());
            }
            else
            {
                return "*";
            }
        }

        /// <summary>
        /// 获取GroupBy语句
        /// </summary>
        /// <param name="groupByFieldList"></param>
        /// <returns></returns>
        public static string GetGroupByFields(List<string> groupByFieldList)
        {
            if (groupByFieldList != null && groupByFieldList.Count > 0)
            {
                return " group by " + string.Join(",", groupByFieldList.Distinct().ToArray());
            }
            else
            {
                return string.Empty;
            }
        }

        public static object ChangeType(object value, Type type)
        {
            if (value == null)
            {
                return null;
            }
            if (type != typeof(string) && string.IsNullOrEmpty(value.ToString()))
            {
                return null;
            }
            if (type == typeof(Guid) || type == typeof(Nullable<Guid>))
            {
                if (value is Guid)
                {
                    return value;
                }
                return new Guid(value.ToString());
            }
            else if (type == typeof(int) || type == typeof(Nullable<int>))
            {
                if (value is int)
                {
                    return value;
                }
                return int.Parse(value.ToString());
            }
            else if (type == typeof(char) || type == typeof(Nullable<char>))
            {
                if (value is char)
                {
                    return value;
                }
                return char.Parse(value.ToString());
            }
            else if (type == typeof(byte) || type == typeof(Nullable<byte>))
            {
                if (value is byte)
                {
                    return value;
                }
                return byte.Parse(value.ToString());
            }
            else if (type == typeof(short) || type == typeof(Nullable<short>))
            {
                if (value is short)
                {
                    return value;
                }
                return short.Parse(value.ToString());
            }
            else if (type == typeof(long) || type == typeof(Nullable<long>))
            {
                if (value is long)
                {
                    return value;
                }
                return long.Parse(value.ToString());
            }
            else if (type == typeof(decimal) || type == typeof(Nullable<decimal>))
            {
                if (value is decimal)
                {
                    return value;
                }
                return decimal.Parse(value.ToString());
            }
            else if (type == typeof(double) || type == typeof(Nullable<double>))
            {
                if (value is double)
                {
                    return value;
                }
                return double.Parse(value.ToString());
            }
            else if (type == typeof(bool) || type == typeof(Nullable<bool>))
            {
                if (value is bool)
                {
                    return value;
                }
                if (value.ToString() == "1")
                {
                    return true;
                }
                else if (value.ToString().Trim().ToLower() == "true")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else if (type == typeof(float) || type == typeof(Nullable<float>))
            {
                if (value is float)
                {
                    return value;
                }
                return float.Parse(value.ToString());
            }
            else if (type == typeof(DateTime) || type == typeof(Nullable<DateTime>))
            {
                if (value is DateTime)
                {
                    return value;
                }
                return DateTime.Parse(value.ToString());
            }
            else if (type == typeof(string))
            {
                if (value is string)
                {
                    return value;
                }
                return value.ToString();
            }
            else if (type == typeof(byte[]) && value is string)
            {
                return value.ToString().Split(',').Select(s => byte.Parse(s)).ToArray();
            }
            else
            {
                return value;
            }
        }
    }

    public struct OrderByStatement
    {
        public string ColumnName;
        public bool IsASC;

        public OrderByStatement(string columnName, bool isAsc)
        {
            ColumnName = columnName;
            IsASC = isAsc;
        }
    }

    public struct WhereStatement
    {
        public string ColumnName;
        public string LogicalOperator;
        public string ColumnValue;

        public WhereStatement(string columnName, string logicalOperator, string columnValue)
        {
            ColumnName = columnName;
            LogicalOperator = logicalOperator;
            ColumnValue = columnValue;
        }
    }

    public struct OperateWhereStatement
    {
        public string ColumnName;
        public string LogicalOperator;
        public string ColumnValue;
        public bool IsValueParameter;

        public OperateWhereStatement(string columnName, string logicalOperator, string columnValue, bool isValueParameter)
        {
            ColumnName = columnName;
            LogicalOperator = logicalOperator;
            ColumnValue = columnValue;
            IsValueParameter = isValueParameter;
        }
    }

    public struct JoinStatement
    {
        public string JoinType;
        public string JoinTable;
        public string RelationOn;

        public JoinStatement(string joinType, string joinTable, string relationOn)
        {
            JoinType = joinType;
            JoinTable = joinTable;
            RelationOn = relationOn;
        }
    }

}
