using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Message
{
    /// <summary>
    /// 同步微信消息模板请求
    /// </summary>
    public class SyncWeChatTemplateRequest : Request, IRequest
    {
        /// <summary>
        /// App账号ID
        /// </summary>
        public Guid AppAccountId { get; set; }
    }

    /// <summary>
    /// 同步微信消息模板响应
    /// </summary>
    public class SyncWeChatTemplateResponse : Response, IResponse
    {
    }
}
