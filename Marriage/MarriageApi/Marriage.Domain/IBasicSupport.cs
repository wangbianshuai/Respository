using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 基础支持
    /// </summary>
    public interface IBasicSupport
    {
        /// <summary>
        /// 获取Access Token
        /// </summary>
        /// <param name="appId"></param>
        /// <param name="secret"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        Entity.Service.BasicSupport.GetAccessTokenResponse GetAccessToken(string appId,string secret, string url);

        /// <summary>
        /// 获取web access_token
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        Entity.Service.BasicSupport.GetWebAccessTokenResponse GetWebAccessToken(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, string code);
    }
}
