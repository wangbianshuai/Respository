using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 相亲用户条件选项值信息表
    /// </summary>
    [TableProperty(Name = "t_UserConditionSelectValue", PrimaryKey = "ItemId")]
    public class ConditionSelectValue : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid ItemId { get; set; }
        /// <summary> 
        /// 相亲用户条件类型Id
        /// </summary> 
        public Guid UserConditionTypeId { get; set; }
        /// <summary> 
        /// 条件项Id
        /// </summary> 
        public Guid ConditionItemId { get; set; }
        /// <summary> 
        /// 值
        /// </summary> 
        public string Value { get; set; }
    }
}