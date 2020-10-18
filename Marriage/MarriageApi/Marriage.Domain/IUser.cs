using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    public interface IUser
    {
        /// <summary>
        /// 判断十分钟之内是否已更新
        /// </summary>
        /// <returns></returns>
        string JudgeIsUpdate();

        /// <summary>
        /// 更新用户数据
        /// </summary>
        /// <param name="userInfoList"></param>
        /// <param name="appAccountId"></param>
        /// <param name="adminUserId"></param>
        /// <returns></returns>
        void UpdateUserData(List<Entity.Service.UserManage.UserInfo> userInfoList, Guid appAccountId, Guid adminUserId);
    }
}
