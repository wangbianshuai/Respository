using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 直播用户状态
    /// </summary>
    public interface ILiveUserStatus
    {
        /// <summary>
        /// 以直播ID和用户ID获取实体数据
        /// </summary>
        /// <param name="liveId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        Entity.Domain.LiveUserStatus GetEntityDataByLiveIdAndUserId(Guid liveId, string userId);

        /// <summary>
        /// 保存用户状态
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        bool SaveUserStatus(Entity.Domain.LiveUserStatus entity);
    }
}
