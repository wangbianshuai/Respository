using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.User
{
    /// <summary>
    /// 同步微信用户请求
    /// </summary>
    public class SyncWeChatUserRequest : Request, IRequest
    {
        /// <summary>
        /// App账号ID
        /// </summary>
        public Guid AppAccountId { get; set; }
    }

    /// <summary>
    /// 同步微信用户响应
    /// </summary>
    public class SyncWeChatUserResponse : Response, IResponse
    {
    }
}
