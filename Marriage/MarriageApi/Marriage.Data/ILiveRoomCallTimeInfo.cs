﻿using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 直播实时音视频通话时长信息表
    /// </summary>
    public interface ILiveRoomCallTimeInfo
    {
        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        Guid Insert(IEntityData entityData);
    }
}
