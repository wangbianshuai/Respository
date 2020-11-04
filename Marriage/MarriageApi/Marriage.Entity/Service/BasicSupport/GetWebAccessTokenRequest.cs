using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.BasicSupport
{
    /// <summary>
    /// 获取web access_token请求
    /// </summary>
    public class GetWebAccessTokenRequest : Request, IRequest
    {
        /// <summary>
        /// 公众号的唯一标识
        /// </summary>
        public string AppId { get; set; }
        /// <summary>
        /// 公众号的appsecret
        /// </summary>
        public string Secret { get; set; }
        /// <summary>
        /// 填写第一步获取的code参数
        /// </summary>
        public string Code { get; set; }
    }

    /// <summary>
    /// 获取web access_token响应
    /// </summary>
    public class GetWebAccessTokenResponse : Response, IResponse
    {
        /// <summary>
        /// 获取到的凭证
        /// </summary>
        public string Access_Token { get; set; }
        /// <summary>
        /// 凭证有效时间，单位：秒
        /// </summary>
        public int Expires_In { get; set; }
        /// <summary>
        /// 用户刷新access_token
        /// </summary>
        public string Refresh_Token { get; set; }
        /// <summary>
        /// 用户唯一标识，请注意，在未关注公众号时，用户访问公众号的网页，也会产生一个用户和公众号唯一的OpenID
        /// </summary>
        public string OpenId { get; set; }
        /// <summary>
        /// 用户授权的作用域，使用逗号（,）分隔
        /// </summary>
        public string Scope { get; set; }
    }
}
