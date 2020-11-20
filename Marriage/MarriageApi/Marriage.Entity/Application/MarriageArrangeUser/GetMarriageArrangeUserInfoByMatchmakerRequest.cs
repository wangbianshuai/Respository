using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageArrangeUser
{
    /// <summary>
    /// 获取红娘下用户信息请求
    /// </summary>
    public class GetMarriageArrangeUserInfoByMatchmakerRequest : Request, IRequest
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// 相亲安排Id
        /// </summary>
        public Guid MarriageArrangeId { get; set; }
    }

    /// <summary>
    /// 获取红娘下用户信息响应
    /// </summary>
    public class GetMarriageArrangeUserInfoByMatchmakerResponse : Response, IResponse
    {
        /// <summary>
        /// 用户信息
        /// </summary>
        public MarriageUser.UserInfo UserInfo { get; set; }
    }
}
