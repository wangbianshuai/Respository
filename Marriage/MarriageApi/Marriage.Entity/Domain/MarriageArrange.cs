using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 相亲安排
    /// </summary>
    public class MarriageArrange
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid MarriageArrangeId { get; set; }
        /// <summary>
        /// 编号
        /// </summary>
        public int ArrangeId { get; set; }
        /// <summary> 
        /// 男生ID
        /// </summary> 
        public Guid ManUserId { get; set; }
        /// <summary> 
        /// 女生ID
        /// </summary> 
        public Guid WomanUserId { get; set; }
        /// <summary> 
        /// 男生红娘
        /// </summary> 
        public Guid ManMatchmakerId { get; set; }
        /// <summary> 
        /// 女生红娘
        /// </summary> 
        public Guid WomanMatchmakerId { get; set; }
        /// <summary> 
        /// 平台红娘
        /// </summary> 
        public Guid AppMatchmakerId { get; set; }
        /// <summary> 
        /// 相亲时间
        /// </summary> 
        public DateTime MarriageDate { get; set; }
        /// <summary> 
        /// 相亲地点
        /// </summary> 
        public string MarriageAddress { get; set; }
        /// <summary> 
        /// 相亲情况
        /// </summary> 
        public string MarriageContent { get; set; }
        /// <summary> 
        /// 状态：0：待相亲，1：有意向，2：无意向，3：牵手成功，4：订婚，5：结婚，6：分手，7：取消
        /// </summary> 
        public byte Status { get; set; }
        /// <summary> 
        /// 来源类型：1：相亲匹配，2：相亲广场，3：相亲牵线
        /// </summary> 
        public byte SourceType { get; set; }
        /// <summary> 
        /// 男生是否同意
        /// </summary> 
        public byte IsManAgree { get; set; }
        /// <summary> 
        /// 男生不同意原因
        /// </summary> 
        public string NoManAgreeRemark { get; set; }
        /// <summary> 
        /// 女生是否同意
        /// </summary> 
        public byte IsWomanAgree { get; set; }
        /// <summary> 
        /// 女生不同意原因
        /// </summary> 
        public string NoWomanAgreeRemark { get; set; }
        /// <summary>
        /// 取消原因
        /// </summary>
        public string CancelReason { get; set; }
        /// <summary> 
        /// 费用日期
        /// </summary> 
        public DateTime FeeDate { get; set; }
        /// <summary> 
        /// 订婚日期
        /// </summary> 
        public DateTime BookMarryDate { get; set; }
        /// <summary> 
        /// 结婚日期
        /// </summary> 
        public DateTime MarryDate { get; set; }
        /// <summary> 
        /// 分手日期
        /// </summary> 
        public DateTime BreakUpDate { get; set; }
        /// <summary> 
        /// 分手原因
        /// </summary> 
        public string BreakUpReason { get; set; }
        /// <summary> 
        /// 相亲总费用
        /// </summary> 
        public decimal Amount { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }

        /// <summary>
        /// 平台红娘
        /// </summary>
        public string AppMatchmakerName { get; set; }
        /// <summary>
        /// 男方
        /// </summary>
        public string ManUserName { get; set; }
        /// <summary>
        /// 女方
        /// </summary>
        public string WomanUserName { get; set; }
    }
}
