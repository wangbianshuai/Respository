using Marriage.Entity.Service.BasicSupport;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Service
{
    /// <summary>
    /// 基础支持
    /// </summary>
    public interface IBasicSupport
    {
        /// <summary>
        /// 获取access_token
        /// </summary>
        GetAccessTokenResponse GetAccessToken(GetAccessTokenRequest request);
    }
}
