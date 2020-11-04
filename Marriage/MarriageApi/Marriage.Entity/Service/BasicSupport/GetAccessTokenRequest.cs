using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.BasicSupport
{
    /// <summary>
    /// 获取access_token请求
    /// </summary>
    public class GetAccessTokenRequest : Request, IRequest
    {
        /// <summary>
        /// 第三方用户唯一凭证
        /// </summary>
        public string AppId { get; set; }
        /// <summary>
        /// 第三方用户唯一凭证密钥，即appsecret
        /// </summary>
        public string Secret { get; set; }
    }

    /// <summary>
    /// 获取access_token响应
    /// </summary>
    public class GetAccessTokenResponse : Response, IResponse
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
        /// 响应时间
        /// </summary>
        public DateTime ResponseTime { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        public GetAccessTokenResponse()
        {
            ResponseTime = DateTime.Now;
        }
    }
}
