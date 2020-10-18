using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{
    /// <summary>
    /// 更新直播状态请求
    /// </summary>
    public class UpdateLiveStatusRequest : Request, IRequest
    {
        /// <summary> 
        /// 直播ID
        /// </summary> 
        public Guid LiveId { get; set; }
        /// <summary>
        /// 状态类型，1：过滤，2：全体禁言,3:直播状态
        /// </summary>
        public byte StatusType { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public bool Status { get; set; }
        /// <summary>
        /// 直播状态
        /// </summary>
        public byte LiveStatus { get; set; }
    }

    /// <summary>
    /// 更新直播状态响应
    /// </summary>
    public class UpdateLiveStatusResponse : Response, IResponse
    {
    }
}
