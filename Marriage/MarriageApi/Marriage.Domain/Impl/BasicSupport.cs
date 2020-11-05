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

        /// <summary>
        /// 获取web access_token
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="string"></param>
        /// <returns></returns>
        public Entity.Service.BasicSupport.GetWebAccessTokenResponse GetWebAccessToken(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, string code)
        {
            var request = new Entity.Service.BasicSupport.GetWebAccessTokenRequest();

            dictionaryConfigs.ForEach(c =>
            {
                if (c.Name == "Wx_Secret") request.Secret = c.Value;
                else if (c.Name == "Wx_AppId") request.AppId = c.Value;
            });

            request.Code = code;

            return _BasicSupport.GetAccessToken(request);
        }
    }
}
