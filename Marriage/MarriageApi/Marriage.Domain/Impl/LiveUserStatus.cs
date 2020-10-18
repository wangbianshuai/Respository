using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 直播用户状态
    /// </summary>
    public class LiveUserStatus : ILiveUserStatus
    {
        public Data.ILiveUserStatus _LiveUserStatus { get; set; }

        /// <summary>
        /// 以直播ID和用户ID获取实体数据
        /// </summary>
        /// <param name="liveId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Entity.Domain.LiveUserStatus GetEntityDataByLiveIdAndUserId(Guid liveId, string userId)
        {
            return Parse.IEntityDataTo<Entity.Domain.LiveUserStatus>(_LiveUserStatus.GetEntityDataByLiveIdAndUserId(liveId, userId));
        }

        /// <summary>
        /// 保存用户状态
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool SaveUserStatus(Entity.Domain.LiveUserStatus entity)
        {
            IEntityData entityData = new EntityData("LiveUserStatus");

            entityData.SetValue("LiveId", entity.LiveId);
            entityData.SetValue("UserId", entity.UserId);
            if (entity.StatusType == 1) entityData.SetValue("IsBanned", entity.Status);
            else if (entity.StatusType == 2) entityData.SetValue("IsRemove", entity.Status);

            if (entity.UserStatusId == Guid.Empty)
            {
                return _LiveUserStatus.Insert(entityData) != Guid.Empty;
            }
            else
            {
                entityData.SetValue("UserStatusId", entity.UserStatusId);
                return _LiveUserStatus.Update(entityData);
            }
        }
    }
}
