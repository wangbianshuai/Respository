﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 相亲配对计算信息表
    /// </summary>
    [TableProperty(Name = "t_MarriageMakePair", PrimaryKey = "MarkPairId")]
    public class MarriageMakePair : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid MakePairId { get; set; }
        /// <summary> 
        /// 相亲用户Id
        /// </summary> 
        public Guid UserId { get; set; }
        /// <summary> 
        /// 对方用户Id
        /// </summary> 
        public Guid OtherSideUserId { get; set; }
        /// <summary> 
        /// 匹配度（%）
        /// </summary> 
        public decimal PercentValue { get; set; }
        /// <summary> 
        /// 更新时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }
}