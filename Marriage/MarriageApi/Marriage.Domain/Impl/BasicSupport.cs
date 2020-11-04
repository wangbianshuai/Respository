using Marriage.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 基础支持
    /// </summary>
    public class BasicSupport : IBasicSupport
    {
      
        public Service.IBasicSupport _BasicSupport { get; set; }

        /// <summary>
        /// 获取Access Token
        /// </summary>
        /// <param name="appAccount"></param>
        /// <param name="serviceInterface"></param>
        /// <returns></returns>
        public Entity.Service.BasicSupport.GetAccessTokenResponse GetAccessToken(string appId, string secret, string url)
        {

            return _BasicSupport.GetAccessToken(new Entity.Service.BasicSupport.GetAccessTokenRequest()
            {
                AppId = appId,
                Secret = secret,
                Url = url
            });
        }
    }
}
