using Marriage.Entity.Service.BasicSupport;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Marriage.Service.Impl
{
    /// <summary>
    /// 基础支持
    /// </summary>
    public class BasicSupport : BaseService, IBasicSupport
    {
        /// <summary>
        /// 获取access_token
        /// </summary>
        public GetAccessTokenResponse GetAccessToken(GetAccessTokenRequest request)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            dict.Add("grant_type", "client_credential");
            dict.Add("appid", request.AppId);
            dict.Add("secret", request.Secret);

            string url = string.Format("{0}?{1}", request.Url, new FormUrlEncodedContent(dict).ReadAsStringAsync().Result);
            return this.GetRequest2<GetAccessTokenResponse>(url);
        }

        /// <summary>
        /// 获取web access_token
        /// </summary>
        public GetWebAccessTokenResponse GetAccessToken(GetWebAccessTokenRequest request)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            dict.Add("grant_type", "authorization_code");
            dict.Add("appid", request.AppId);
            dict.Add("secret", request.Secret);
            dict.Add("code", request.Code);

            request.Url = "https://api.weixin.qq.com/sns/oauth2/access_token";

            string url = string.Format("{0}?{1}", request.Url, new FormUrlEncodedContent(dict).ReadAsStringAsync().Result);
            return this.GetRequest2<GetWebAccessTokenResponse>(url);
        }
    }
}
