using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{
    /// <summary>
    /// 结束直播请求
    /// </summary>
    public class EndLiveRequest : Request, IRequest
    {
        /// <summary> 
        /// 直播ID
        /// </summary> 
        public Guid LiveId { get; set; }
    }

    /// <summary>
    /// 结束直播响应
    /// </summary>
    public class EndLiveResponse : Response, IResponse
    {
    }
}
