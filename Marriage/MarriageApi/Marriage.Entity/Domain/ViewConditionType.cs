using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 条件类型
    /// </summary>
    public class ConditionType
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid ConditionTypeId { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
        /// <summary>
        /// 选项计数
        /// </summary>
        public int ItemCount { get; set; }
    }
}
