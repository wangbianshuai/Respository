using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.WxUser
{
    /// <summary>
    /// 通过微信小程序获取微信用户请求
    /// </summary>
    public class GetOpenIdByCodeRequest : Request, IRequest
    {
        /// <summary>
        /// Code
        /// </summary>
        public string Code { get; set; }
    }

    /// <summary>
    /// 通过微信小程序获取微信用户响应
    /// </summary>
    public class GetOpenIdByCodeResponse : Response, IResponse
    {
        /// <summary>
        /// 微信OpenId
        /// </summary>
        public string openid { get; set; }
        /// <summary>
        /// 会话密钥
        /// </summary>
        public string session_key { get; set; }
    }
}
