using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.UserManage
{
    /// <summary>
    /// 通过微信小程序获取微信用户openid请求
    /// </summary>
    public class GetOpenIdByCodeRequest : Request, IRequest
    {
        /// <summary>
        /// 第三方用户唯一凭证
        /// </summary>
        public string AppId { get; set; }
        /// <summary>
        /// 第三方用户唯一凭证密钥，即appsecret
        /// </summary>
        public string Secret { get; set; }
        /// <summary>
        /// Code
        /// </summary>
        public string Code { get; set; }
    }

    /// <summary>
    /// 通过微信小程序获取微信用户openid响应
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
