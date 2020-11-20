using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageArrange
{
    /// <summary>
    /// 更新相亲安排请求
    /// </summary>
    public class UpdateMarriageArrangeRequest : Request, IRequest
    {
        /// <summary>
        /// 相亲安排Id
        /// </summary>
        public Guid MarriageArrangeId { get; set; }
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
        /// 备注
        /// </summary>
        public string Remark { get; set; }
    }

    /// <summary>
    /// 更新相亲安排响应 
    /// </summary>
    public class UpdateMarriageArrangeResponse : Response, IResponse
    {
    }
}
