using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 相亲用户条件类型视图
    /// </summary>
    public class ViewUserConditionType
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
        /// 条件类型名称
        /// </summary> 
        public string ConditionTypeName { get; set; }
        /// <summary> 
        /// 用户选择值计数
        /// </summary> 
        public int UserItemCount { get; set; }
        /// <summary> 
        /// 总项数
        /// </summary> 
        public int ItemCount { get; set; }
        /// <summary> 
        /// 完成百分比
        /// </summary> 
        public int Percentage { get; set; }
    }
}
