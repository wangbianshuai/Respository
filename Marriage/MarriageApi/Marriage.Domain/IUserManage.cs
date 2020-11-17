using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 用户管理
    /// </summary>
    public interface IUserManage
    {
        /// <summary>
        /// 获取用户列表
        /// </summary>
        /// <param name="accessToken"></param>
        /// <param name="adminUserId"></param>
        /// <param name="url"></param>
        Entity.Service.UserManage.GetUserListResponse GetUserList(string accessToken, string url);
        /// <summary>
        /// 批量获取用户基本信息
        /// </summary>
        /// <param name="openIdList"></param>
        /// <param name="accessToken"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        Entity.Service.UserManage.BatchGetUserInfoResponse BatchGetUserInfo(List<string> openIdList, string accessToken, string url);

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="accessToken"></param>
        /// <param name="openId"></param>
        /// <returns></returns>
        Entity.Service.UserManage.GetUserInfoResponse GetUserInfo(string accessToken, string openId);

        /// <summary>
        /// 通过微信小程序获取微信用户openid
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        Entity.Service.UserManage.GetOpenIdByCodeResponse GetOpenIdByCode(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, string code);
    }
}
