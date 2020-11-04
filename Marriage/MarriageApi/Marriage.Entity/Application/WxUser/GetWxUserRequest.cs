using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.WxUser
{
    /// <summary>
    /// 获取微信用户请求
    /// </summary>
    public class GetWxUserRequest : Request, IRequest
    {
        /// <summary>
        /// Code
        /// </summary>
        public string Code { get; set; }
    }

    /// <summary>
    /// 获取微信用户响应
    /// </summary>
    public class GetWxUserResponse : Response, IResponse
    {
        /// <summary>
        /// 用户数据
        /// </summary>
        public WxUser Data { get; set; }
    }

    /// <summary>
    /// 微信用户
    /// </summary>
    public class WxUser
    {
        /// <summary>
        /// OpenID
        /// </summary>
        public string openid { get; set; }
        /// <summary>
        /// 昵称
        /// </summary>
        public string nickname { get; set; }
    }
}
