using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Entity
{
    /// <summary>
    /// 查询请求
    /// </summary>
    public class QueryRequest : IRequest
    {
        /// <summary>
        /// 是否分页
        /// </summary>
        public bool IsPage { get; set; }
        /// <summary>
        /// 是否Excel导出
        /// </summary>
        public bool IsExcel { get; set; }
        /// <summary>
        /// 页索引
        /// </summary>
        public int PageIndex { get; set; }
        /// <summary>
        /// PageSize
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        /// Top数
        /// </summary>
        public int TopCount { get; set; }
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 查询属性名集合
        /// </summary>
        public List<string> SelectNames { get; set; }
        /// <summary>
        /// 查询条件
        /// </summary>
        public List<Condition> Conditions { get; set; }
        /// <summary>
        /// 排序
        /// </summary>
        public List<OrderBy> OrderBys { get; set; }
        /// <summary>
        /// 分组
        /// </summary>
        public List<GroupBy> GroupBys { get; set; }
        /// <summary>
        /// Excel导出Header信息
        /// </summary>
        public List<HeaderInfo> HeaderInfos { get; set; }
        /// <summary>
        /// 复合查询实体名称
        /// </summary>
        public string EntityName { get; set; }
        /// <summary>
        /// 复合查询属性名称
        /// </summary>
        public string PropertyName { get; set; }
        /// <summary>
        /// 是否查询RowVersion
        /// </summary>
        public bool IsRowVersion { get; set; }
        /// <summary>
        /// 是否数据权限
        /// </summary>
        public bool IsDataRight { get; set; }

        /// <summary>
        /// 是否数据状态
        /// </summary>
        public bool IsDataStatus { get; set; }

        /// <summary>
        /// 复合查询列表
        /// </summary>
        public List<QueryRequest> ComplexQueryList { get; set; }

        /// <summary>
        /// 查询条件
        /// </summary>
        public class Condition
        {
            /// <summary>
            /// 属性名
            /// </summary>
            public string Name { get; set; }
            /// <summary>
            /// 逻辑符
            /// </summary>
            public string Logic { get; set; }
            /// <summary>
            /// 查询值
            /// </summary>
            public string Value { get; set; }

            public List<Condition> Conditions { get; set; }
        }

        public class OrderBy
        {
            /// <summary>
            /// 属性名
            /// </summary>
            public string Name { get; set; }
            /// <summary>
            /// 是否倒序
            /// </summary>
            public bool IsDesc { get; set; }
        }

        public class GroupBy
        {
            /// <summary>
            /// 映射名
            /// </summary>
            public string AsName { get; set; }
            /// <summary>
            /// 属性名
            /// </summary>
            public string Name { get; set; }
            /// <summary>
            /// 表达式
            /// </summary>
            public string Logic { get; set; }
        }

        public class SqlGroupBy
        {
            /// <summary>
            /// 映射名
            /// </summary>
            public string AsName { get; set; }
            /// <summary>
            /// 字段名
            /// </summary>
            public string FieldName { get; set; }
            /// <summary>
            /// 表达式
            /// </summary>
            public string Expression { get; set; }
            /// <summary>
            /// 表名
            /// </summary>
            public string TableName { get; set; }
        }

        public class HeaderInfo
        {
            public string Name { get; set; }
            public string Label { get; set; }
        }
    }
}
