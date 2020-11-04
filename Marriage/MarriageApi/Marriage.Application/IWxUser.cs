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
    }
}
