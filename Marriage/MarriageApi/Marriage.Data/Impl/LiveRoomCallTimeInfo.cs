using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data.Impl
{
    /// <summary>
    /// 直播实时音视频通话时长信息表
    /// </summary>
    public class LiveRoomCallTimeInfo : EntityAccess, ILiveRoomCallTimeInfo
    {
        public LiveRoomCallTimeInfo()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.LiveRoomCallTimeInfo>();
        }

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        public Guid Insert(IEntityData entityData)
        {
            object primaryKey = null;
            if (this.InsertEntity(entityData, out primaryKey)) return (Guid)primaryKey;
            return Guid.Empty;
        }
    }
}
