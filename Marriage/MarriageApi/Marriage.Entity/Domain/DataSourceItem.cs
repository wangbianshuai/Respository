using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 数据源选项
    /// </summary>
    public class DataSourceItem
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid ItemId { get; set; }
        /// <summary> 
        /// 数据源ID
        /// </summary> 
        public Guid DataSourceId { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 值
        /// </summary> 
        public string Value { get; set; }
    }
}
