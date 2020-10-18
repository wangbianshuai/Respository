using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{
    /// <summary>
    /// 删除直播请求
    /// </summary>
    public class DeleteLiveRequest : Request, IRequest
    {
        /// <summary> 
        /// 直播ID
        /// </summary> 
        public Guid LiveId { get; set; }
    }

    /// <summary>
    /// 删除直播响应
    /// </summary>
    public class DeleteLiveResponse : Response, IResponse
    {
    }
}
