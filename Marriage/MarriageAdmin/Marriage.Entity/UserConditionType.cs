using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity
{
    /// <summary>
    /// 相亲用户条件类型信息表
    /// </summary>
    [TableProperty(Name = "t_UserConditionType", PrimaryKey = "UserConditionTypeId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class UserConditionType : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid UserConditionTypeId { get; set; }
        /// <summary> 
        /// 相亲用户Id
        /// </summary> 
        public Guid UserId { get; set; }
        /// <summary> 
        /// 选择类型，1：条件值，2：择偶标准值
        /// </summary> 
        public byte SelectType { get; set; }
        /// <summary> 
        /// 条件类型Id
        /// </summary> 
        public Guid ConditionTypeId { get; set; }
        /// <summary>
        /// 是否公开
        /// </summary>
        public byte IsPublic { get; set; }
        /// <summary> 
        /// 创建人
        /// </summary> 
        public Guid CreateUser { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
        /// <summary> 
        /// 更新人
        /// </summary> 
        public Guid UpdateUser { get; set; }
        /// <summary> 
        /// 更新时间
        /// </summary> 
        public DateTime UpdateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }

    /// <summary>
    /// 相亲用户条件选项值信息表
    /// </summary>
    [TableProperty(Name = "t_UserConditionSelectValue", PrimaryKey = "ItemId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class UserConditionSelectValue : EntityModel, IEntity
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
