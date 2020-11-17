using Marriage.Entity.Application.WxUser;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 微信用户
    /// </summary>
    public interface IWxUser
    {
        /// <summary>
        /// 获取微信用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        GetWxUserResponse GetWxUser(GetWxUserRequest request);

        /// <summary>
        /// 通过微信小程序获取微信用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        GetOpenIdByCodeResponse GetOpenIdByCode(GetOpenIdByCodeRequest request);

        /// <summary>
        /// 微信用户授权登录
        /// </summary>
        AuthLoginResponse AuthLogin(AuthLoginRequest request);
    }
}
