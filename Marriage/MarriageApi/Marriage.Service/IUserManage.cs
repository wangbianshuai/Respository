using Marriage.Entity.Service.UserManage;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Service
{
    /// <summary>
    /// 用户管理
    /// </summary>
    public interface IUserManage
    {
        /// <summary>
        /// 获取用户列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        GetUserListResponse GetUserList(GetUserListRequest request);

        /// <summary>
        /// 批量获取用户基本信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BatchGetUserInfoResponse BatchGetUserInfo(BatchGetUserInfoRequest request);

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        GetUserInfoResponse GetUserInfo(GetUserInfoRequest request);
    }
}
