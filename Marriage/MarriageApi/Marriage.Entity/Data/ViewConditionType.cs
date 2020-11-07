using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 条件类型信息视图
    /// </summary>
    [TableProperty(Name = "v_ConditionType", PrimaryKey = "ConditionTypeId")]
    public class ViewConditionType : ConditionType
    {
        /// <summary>
        /// 选项计数
        /// </summary>
        public int ItemCount { get; set; }
    }
}
