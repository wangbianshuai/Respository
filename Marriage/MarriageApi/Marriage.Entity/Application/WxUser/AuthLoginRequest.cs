using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.WxUser
{
    /// <summary>
    /// 微信用户授权登录请求
    /// </summary>
    public class AuthLoginRequest : Request, IRequest
    {
        /// <summary>
        /// scene
        /// </summary>
        public string Scene { get; set; }
        /// <summary>
        /// 用户信息
        /// </summary>
        public WxUserInfo UserInfo { get; set; }
    }

    /// <summary>
    /// 微信用户授权登录响应
    /// </summary>
    public class AuthLoginResponse : Response, IResponse
    { 
    }

    /// <summary>
    /// 微信用户
    /// </summary>
    public class WxUserInfo
    {
        /// <summary>
        /// 用户的唯一标识
        /// </summary>
        public string openid { get; set; }
        /// <summary>
        /// 用户昵称
        /// </summary>
        public string nickname { get; set; }
        /// <summary>
        /// 用户头像
        /// </summary>
        public string avatarUrl { get; set; }
    }
}
