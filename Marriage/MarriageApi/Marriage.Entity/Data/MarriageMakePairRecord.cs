﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 相亲配对计算记录表
    /// </summary>
    [TableProperty(Name = "t_MarriageMakePairRecord", PrimaryKey = "DetailId")]
    public class MarriageMakePairRecord : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid DetailId { get; set; }
        /// <summary> 
        /// 配对明细Id
        /// </summary> 
        public Guid MakePairDetailId { get; set; }
        /// <summary> 
        /// 条件类型Id
        /// </summary> 
        public Guid ConditionTypeId { get; set; }
        /// <summary> 
        /// 条件类型
        /// </summary> 
        public string ConditionTypeNmae { get; set; }
        /// <summary> 
        /// 条件选项Id
        /// </summary> 
        public Guid ConditionItemId { get; set; }
        /// <summary> 
        /// 条件标题
        /// </summary> 
        public string ConditionItemTile { get; set; }
        /// <summary> 
        /// 自己选择值
        /// </summary> 
        public string SelfSelectValue { get; set; }
        /// <summary> 
        /// 对方选择值
        /// </summary> 
        public string OtherSideSelectValue { get; set; }
        /// <summary> 
        /// 匹配度（%）
        /// </summary> 
        public decimal PercentValue { get; set; }
    }
}