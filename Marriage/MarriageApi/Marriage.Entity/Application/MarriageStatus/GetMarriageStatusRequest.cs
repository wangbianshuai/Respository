using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageStatus
{
    /// <summary>
    /// 获取相亲状态请求
    /// </summary>
    public class GetMarriageStatusRequest : Request, IRequest
    {
        /// <summary>
        /// 相亲安排Id
        /// </summary>
        public Guid MarriageArrangeId { get; set; }
    }

    /// <summary>
    /// 获取相亲状态响应
    /// </summary>
    public class GetMarriageStatusResponse : Response, IResponse
    {
        /// <summary>
        /// 主键
        /// </summary>
        public Guid MarriageArrangeId { get; set; }
        /// <summary> 
        /// 状态：0：待相亲，1：有意向，2：无意向，3：牵手成功，4：订婚，5：结婚，6：分手，7：取消
        /// </summary> 
        public byte Status { get; set; }
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
        /// 订婚日期
        /// </summary> 
        public string BookMarryDate { get; set; }
        /// <summary> 
        /// 结婚日期
        /// </summary> 
        public string MarryDate { get; set; }
        /// <summary> 
        /// 分手日期
        /// </summary> 
        public string BreakUpDate { get; set; }
        /// <summary> 
        /// 分手原因
        /// </summary> 
        public string BreakUpReason { get; set; }
    }
}
