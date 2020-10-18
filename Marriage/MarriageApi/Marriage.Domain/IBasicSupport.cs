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
        /// <param name="appAccount"></param>
        /// <param name="serviceInterface"></param>
        /// <returns></returns>
        Entity.Service.BasicSupport.GetAccessTokenResponse GetAccessToken(Entity.Domain.AppAccount appAccount, Entity.Domain.ServiceInterface serviceInterface);
    }
}
