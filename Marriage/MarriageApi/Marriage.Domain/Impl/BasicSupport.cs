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

        public IAppAccountToken _AppAccountToken { get; set; }

        static object _lock = new object();

        /// <summary>
        /// 获取Access Token
        /// </summary>
        /// <param name="appAccount"></param>
        /// <param name="serviceInterface"></param>
        /// <returns></returns>
        public Entity.Service.BasicSupport.GetAccessTokenResponse GetAccessToken(Entity.Domain.AppAccount appAccount, Entity.Domain.ServiceInterface serviceInterface)
        {
            string accessToken = DataCache.GetAppAccessToken(appAccount.AppId);

            //获取数据库获取Access Token
            Entity.Domain.AppAccountToken appAccountToken = null;
            if(string.IsNullOrEmpty(accessToken)) appAccountToken = _AppAccountToken.GetAccessToken(appAccount.AppAccountId);
            if (appAccountToken != null) accessToken = appAccountToken.AccessToken;

            if (!string.IsNullOrEmpty(accessToken)) return new Entity.Service.BasicSupport.GetAccessTokenResponse()
            {
                Access_Token = accessToken
            };

            lock (_lock)
            {
                var response = _BasicSupport.GetAccessToken(new Entity.Service.BasicSupport.GetAccessTokenRequest()
                {
                    AppId = appAccount.AppId,
                    Secret = appAccount.Secret,
                    Url = serviceInterface.Url,
                });

                if (response.ErrCode == 0)
                {
                    DataCache.AddAppAccessToken(appAccount.AppId, new DataCache.AppAccessToken()
                    {
                        AccessToken = response.Access_Token,
                        //有效结束时间响应时间加返回有效时间秒数减10，避免时间误差
                        ExpiresEndDate = response.ResponseTime.AddSeconds(response.Expires_In - 10)
                    });

                    if (appAccountToken == null)
                    {
                        appAccountToken = new Entity.Domain.AppAccountToken()
                        {
                            AccessToken = response.Access_Token,
                            ExpiresIn = response.Expires_In,
                            AppAccountId = appAccount.AppAccountId
                        };

                        _AppAccountToken.Insert(appAccountToken);
                    }
                    else
                    {
                        appAccountToken.AccessToken = response.Access_Token;
                        appAccountToken.ExpiresIn = response.Expires_In;

                        _AppAccountToken.Update(appAccountToken);
                    }
                }

                return response;
            }
        }
    }
}
