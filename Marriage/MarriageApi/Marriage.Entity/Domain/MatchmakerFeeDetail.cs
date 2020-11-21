using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 红娘中介费明细表
    /// </summary>
    public class MatchmakerFeeDetail
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid DetailId { get; set; }
        /// <summary> 
        /// 红娘Id
        /// </summary> 
        public Guid MatchmakerId { get; set; }
        /// <summary>
        /// 红娘类型，1：男方，2：女方，3：平台
        /// </summary>
        public byte MatchmakerType { get; set; }
        /// <summary> 
        /// 相亲安排Id
        /// </summary> 
        public Guid MarriageArrangeId { get; set; }
        /// <summary> 
        /// 费用日期
        /// </summary> 
        public DateTime FeeDate { get; set; }
        /// <summary> 
        /// 金额
        /// </summary> 
        public decimal Amount { get; set; }
        /// <summary> 
        /// 平台中介费
        /// </summary> 
        public decimal AppAmount { get; set; }
        /// <summary>
        /// 男方
        /// </summary>
        public string ManUserName { get; set; }
        /// <summary>
        /// 女方
        /// </summary>
        public string WomanUserName { get; set; }
        /// <summary>
        /// 男方头像
        /// </summary>
        public string ManHeadImgUrl { get; set; }
        /// <summary>
        /// 男方年龄
        /// </summary>
        public int ManAge { get; set; }
        /// <summary>
        /// 女方头像
        /// </summary>
        public string WomanHeadImgUrl { get; set; }
        /// <summary>
        /// 女方年龄
        /// </summary>
        public int WomanAge { get; set; }
    }
}
