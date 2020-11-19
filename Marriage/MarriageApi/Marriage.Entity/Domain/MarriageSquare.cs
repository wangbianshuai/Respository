using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{

    /// <summary>
    /// 相亲广场
    /// </summary>
    public class MarriageSquare
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid MarriageSquareId { get; set; }
        /// <summary> 
        /// 相亲用户ID
        /// </summary> 
        public Guid UserId { get; set; }
        /// <summary> 
        /// 对方用户ID
        /// </summary> 
        public Guid OtherSideUserId { get; set; }
        /// <summary> 
        /// 更新时间
        /// </summary> 
        public DateTime UpdateDate { get; set; }
        /// <summary> 
        /// 玫瑰数量
        /// </summary> 
        public int RoseCount { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
    }
}
