using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 直播实时音视频通话时长信息
    /// </summary>
    public interface ILiveRoomCallTimeInfo
    {
        /// <summary>
        /// 获取直播实时音视频通话时长信息
        /// </summary>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        Entity.Domain.LiveRoomCallTimeInfo GetLiveRoomCallTimeInfo(List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live);

        /// <summary>
        /// 新增直播实时音视频通话时长信息
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        bool Insert(Entity.Domain.LiveRoomCallTimeInfo entity);
    }
}
