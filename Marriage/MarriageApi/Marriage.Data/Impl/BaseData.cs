using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace Marriage.Data.Impl
{
    /// <summary>
    /// 数据基类
    /// </summary>
    public class BaseData : EntityAccess
    {
        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="queryInfo"></param>
        /// <returns></returns>
        public List<IEntityData> QueryDataList(Entity.Data.QueryInfo queryInfo)
        {
            string tableName = queryInfo.TableName ?? this.EntityType.TableName;
            IQuery query = new Query(tableName);
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();

            string whereSql = GetWhereSql(queryInfo, parameterList);
            string selectSql = queryInfo.SelectFieldList == null ? "t.*" : string.Join(",", queryInfo.SelectFieldList);
            string orderBySql = GetOrderBySql(queryInfo);

            int pageIndex = queryInfo.PageIndex;
            int pageSize = queryInfo.PageSize;

            StringBuilder sb = new StringBuilder();

            if (pageIndex == 0)
            {
                sb.AppendFormat("select {0}", selectSql);
                sb.AppendFormat(" from {0} {1} {2}", tableName + " t" + this.AddWithNoLock(), whereSql, orderBySql);
            }
            else
            {
                sb.Append("select * from (");
                sb.AppendFormat("select row_number() over({0}) as rn,", orderBySql);
                sb.Append(selectSql);
                sb.AppendFormat(" from {0} {1}) a", tableName + " t" + this.AddWithNoLock(), whereSql);
                sb.AppendFormat(" where a.rn > {0} and a.rn <= {1}", (pageIndex - 1) * pageSize, pageIndex * pageSize);
            }

            query.SetSql(sb.ToString(), parameterList);

            return this.SelectEntities(query);
        }

        /// <summary>
        /// 查询总记录数
        /// </summary>
        /// <param name="queryInfo"></param>
        /// <returns></returns>
        public int QueryCount(Entity.Data.QueryInfo queryInfo)
        {
            string tableName = queryInfo.TableName ?? this.EntityType.TableName;
            IQuery query = new Query(tableName);
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();

            string whereSql = GetWhereSql(queryInfo, parameterList);
            string selectSql = "count(*) TotalCount";

            int pageIndex = queryInfo.PageIndex;
            int pageSize = queryInfo.PageSize;

            StringBuilder sb = new StringBuilder();

            sb.AppendFormat("select {0}", selectSql);
            sb.AppendFormat(" from {0} {1}", tableName + " t" + this.AddWithNoLock(), whereSql);

            query.SetSql(sb.ToString(), parameterList);

            return this.SelectEntity(query).GetValue<int>("TotalCount");
        }

        /// <summary>
        /// 查询统计
        /// </summary>
        /// <param name="queryInfo"></param>
        /// <returns></returns>
        public IEntityData QuerySum(Entity.Data.QueryInfo queryInfo)
        {
            string tableName = queryInfo.TableName ?? this.EntityType.TableName;
            IQuery query = new Query(tableName);
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();

            string whereSql = GetWhereSql(queryInfo, parameterList);
            string selectSql = queryInfo.SumSql;

            int pageIndex = queryInfo.PageIndex;
            int pageSize = queryInfo.PageSize;

            StringBuilder sb = new StringBuilder();

            sb.AppendFormat("select {0}", selectSql);
            sb.AppendFormat(" from {0} {1}", tableName + " t" + this.AddWithNoLock(), whereSql);

            query.SetSql(sb.ToString(), parameterList);

            return this.SelectEntity(query);
        }

        protected string AddWithNoLock()
        {
            if (this.CurrentDataBase.ClientType == ServerClient.MySqlClient) return string.Empty;
            return " with(nolock)";
        }

        protected string GetOrderBySql(Entity.Data.QueryInfo queryInfo)
        {
            List<string> orderList = new List<string>();

            queryInfo.OrderByList.ForEach(d =>
            {
                orderList.Add(string.Format("{0} {1}", GetPropertyName(d.Name), d.IsDesc ? "desc" : "asc"));
            });

            return string.Format("order by {0}", string.Join(",", orderList));
        }

        string GetPropertyName(string name)
        {
            return this.EntityType.Properties.Where(w => w.Name == name).FirstOrDefault().Name;
        }

        protected string GetWhereSql(Entity.Data.QueryInfo queryInfo, List<IDbDataParameter> parameterList)
        {
            List<string> whereList = new List<string>();

            queryInfo.ConditionList.ForEach(c =>
            {
                if (c.OpearteLogic == "like")
                {
                    string parameterName = "@" + Guid.NewGuid().ToString().Substring(0, 8);
                    parameterList.Add(this.InParameter(parameterName, "%" + c.Value + "%"));

                    List<string> likeWheres = new List<string>();
                    c.Name.Split(',').ToList().ForEach(n =>
                    {
                        likeWheres.Add(string.Format("{0} like {1}", n, parameterName));
                    });

                    whereList.Add(string.Format("({0})", string.Join(" or ", likeWheres)));
                }
                else
                {
                    string parameterName = c.ParameterName ?? "@" + c.Name;
                    parameterList.Add(this.InParameter(parameterName, c.Value));
                    whereList.Add(string.Format("{0} {1} {2}", c.Name, c.OpearteLogic, parameterName));
                }
            });

            return string.Format("where {0}", string.Join(" and ", whereList));
        }
    }
}
