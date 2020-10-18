using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.LiveCloud
{
    /// <summary>
    /// 取消通用混流请求
    /// </summary>
    public class CancelLiveMixedStreamRequest : Request, IRequest
    {
        /// <summary>
        /// SecretId
        /// </summary>
        public string SecretId { get; set; }
        /// <summary>
        /// SecretKey
        /// </summary>
        public string SecretKey { get; set; }
        /// <summary>
        /// 服务结节主机
        /// </summary>
        public string Endpoint { get; set; }
        /// <summary>
        /// 混流会话（申请混流开始到取消混流结束）标识 ID。
        /// </summary>
        public string MixStreamSessionId { get; set; }
    }

    /// <summary>
    /// 取消通用混流响应
    /// </summary>
    public class CancelLiveMixedStreamResponse : Response, IResponse
    {

    }
}
