using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser
{
    /// <summary>
    /// 获取红娘下用户信息请求
    /// </summary>
    public class GetUserByMatchmakerRequest : Request, IRequest
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }
    }

    /// <summary>
    /// 获取红娘下用户信息响应
    /// </summary>
    public class GetUserByMatchmakerResponse : Response, IResponse
    {
        /// <summary>
        /// 用户信息
        /// </summary>
        public MarriageUser3 UserInfo { get; set; }
        /// <summary>
        /// 状态信息
        /// </summary>
        public StatusInfo StatusInfo { get; set; }
    }
}
