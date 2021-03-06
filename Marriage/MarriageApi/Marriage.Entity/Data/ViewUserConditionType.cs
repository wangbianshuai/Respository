﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 相亲用户条件类型视图
    /// </summary>
    [TableProperty(Name = "v_UserConditionType", PrimaryKey = "UserConditionTypeId")]
    public class ViewUserConditionType : EntityModel, IEntity
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
        public int ManUserItemCount { get; set; }
        /// <summary> 
        /// 用户选择值计数
        /// </summary> 
        public int WomanUserItemCount { get; set; }
        /// <summary> 
        /// 总项数
        /// </summary> 
        public int ManItemCount { get; set; }
        /// <summary> 
        /// 完成百分比
        /// </summary> 
        public int ManPercentage { get; set; }
        /// <summary> 
        /// 总项数
        /// </summary> 
        public int WomanItemCount { get; set; }
        /// <summary> 
        /// 完成百分比
        /// </summary> 
        public int WomanPercentage { get; set; }
    }
}