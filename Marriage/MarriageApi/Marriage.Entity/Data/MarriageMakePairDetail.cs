using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 相亲配对计算明细表
    /// </summary>
    [TableProperty(Name = "t_MarriageMakePairDetail", PrimaryKey = "DetailId")]
    public class MarriageMakePairDetail : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid DetailId { get; set; }
        /// <summary> 
        /// 配对Id
        /// </summary> 
        public Guid MarkPairId { get; set; }
        /// <summary> 
        /// 用户Id
        /// </summary> 
        public Guid UserId { get; set; }
        /// <summary> 
        /// 匹配度（%）
        /// </summary> 
        public decimal PercentValue { get; set; }
    }
}