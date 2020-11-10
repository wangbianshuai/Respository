using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser
{
    /// <summary>
    /// 获取红娘下用户信息请求
    /// </summary>
    public class GetUserInfoByMatchmakerRequest : Request, IRequest
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }
    }

    /// <summary>
    /// 获取用户信息响应
    /// </summary>
    public class GetUserInfoByMatchmakerResponse : Response, IResponse
    {
        /// <summary>
        /// 用户信息
        /// </summary>
        public UserInfo UserInfo { get; set; }
    }
}
