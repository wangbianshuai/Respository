using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser2
{
    /// <summary>
    /// 获取用户下用户信息请求
    /// </summary>
    public class GetUserInfoByUserRequest : Request, IRequest
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }
        /// <summary>
        /// 类型，1：相亲广场用户，2：相亲安排用户
        /// </summary>
        public byte Type { get; set; }
    }

    /// <summary>
    /// 获取用户下用户信息响应
    /// </summary>
    public class GetUserInfoByUserResponse : Response, IResponse
    {
        /// <summary>
        /// 用户信息
        /// </summary>
        public MarriageUser.UserInfo UserInfo { get; set; }
    }
}
