using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 数据源
    /// </summary>
    public class DataSource
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid DataSourceId { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
        /// <summary>
        /// 数据源选项
        /// </summary>
        public List<DataSourceItem> Items { get; set; }
    }
}
