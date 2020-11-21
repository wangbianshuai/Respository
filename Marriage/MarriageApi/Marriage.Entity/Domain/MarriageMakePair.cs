using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 相亲匹配
    /// </summary>
    public class MarriageMakePair
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
    }
}
