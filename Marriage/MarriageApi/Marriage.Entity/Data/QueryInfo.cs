using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 查询数据
    /// </summary>
    public class QueryInfo
    {
        /// <summary>
        /// 分页索引
        /// </summary>
        public int PageIndex { get; set; }
        /// <summary>
        /// 分页大小
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        /// 查询字符集合
        /// </summary>
        public List<string> SelectFieldList { get; set; }
        /// <summary>
        /// 查询条件
        /// </summary>
        public List<QueryCondition> ConditionList { get; set; }
        /// <summary>
        /// 排序
        /// </summary>
        public List<OrderByType> OrderByList { get; set; }

        /// <summary>
        /// 统计Sql
        /// </summary>
        public string SumSql { get; set; }
        /// <summary>
        /// 表名或视图名
        /// </summary>
        public string TableName { get; set; }
    }

    /// <summary>
    /// 排序
    /// </summary>
    public class OrderByType
    {
        /// <summary>
        /// 字段名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 类型，asc 或 desc
        /// </summary>
        public bool IsDesc { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="name"></param>
        /// <param name="type"></param>
        public OrderByType(string name, string type)
        {
            this.Name = name;
            this.IsDesc = !string.IsNullOrEmpty(type) && type.ToLower() == "desc";
        }
    }

    /// <summary>
    /// 查询条件
    /// </summary>
    public class QueryCondition
    {
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 参数名
        /// </summary>
        public string ParameterName { get; set; }
        /// <summary>
        /// 操作符
        /// </summary>
        public string OpearteLogic { get; set; }
        /// <summary>
        /// 值
        /// </summary>
        public object Value { get; set; }

        /// <summary>
        /// 查询条件
        /// </summary>
        /// <param name="name"></param>
        /// <param name="operateLogic"></param>
        /// <param name="value"></param>
        /// <param name="parameterName"></param>
        public QueryCondition(string name, string operateLogic, object value, string parameterName = null)
        {
            Name = name;
            OpearteLogic = operateLogic;
            Value = value;
            ParameterName = parameterName;
        }
    }
}
