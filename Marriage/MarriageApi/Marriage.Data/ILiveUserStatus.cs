using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
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
        IEntityData GetEntityDataByLiveIdAndUserId(Guid liveId, string userId);

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        Guid Insert(IEntityData entityData);

        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        bool Update(IEntityData entityData);
    }
}
