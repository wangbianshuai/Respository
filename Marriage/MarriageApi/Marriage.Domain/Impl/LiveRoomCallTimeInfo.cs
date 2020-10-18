using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 直播实时音视频通话时长信息
    /// </summary>
    public class LiveRoomCallTimeInfo : ILiveRoomCallTimeInfo
    {
        public ILiveCloud _LiveCloud { get; set; }

        public Data.ILiveRoomCallTimeInfo _LiveRoomCallTimeInfo { get; set; }

        /// <summary>
        /// 获取直播实时音视频通话时长信息
        /// </summary>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        public Entity.Domain.LiveRoomCallTimeInfo GetLiveRoomCallTimeInfo(List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live)
        {
            Entity.Domain.LiveRoomCallTimeInfo liveRoomCallTimeInfo = new Entity.Domain.LiveRoomCallTimeInfo();
            liveRoomCallTimeInfo.LiveId = live.LiveId;
            liveRoomCallTimeInfo.InfoId = Guid.NewGuid();

            List<string> commIdList = new List<string>();

            //1、获取房间列表信息
            int pageNumber = 1;
            bool blNextPage = false;
            do
            {
                Entity.Service.LiveCloud.GetRoomInformationResponse response = _LiveCloud.GetRoomInformation(configs, live, pageNumber);
                if (response.ErrCode != 0)
                {
                    liveRoomCallTimeInfo.ErrorMessage = response.ErrMsg;
                    return liveRoomCallTimeInfo;
                }

                commIdList.AddRange(response.RoomList.Select(s => s.CommId));
                if (response.Total > response.RoomList.Count)
                {
                    blNextPage = true;
                    pageNumber += 1;
                }
            }
            while (blNextPage);

            double totalMinutes = 0;

            //2、获取通话明细信息
            foreach (var c in commIdList)
            {
                Entity.Service.LiveCloud.GetCallDetailResponse response = _LiveCloud.GetCallDetail(configs, live, c);
                if (response.ErrCode != 0)
                {
                    liveRoomCallTimeInfo.ErrorMessage = response.ErrMsg;
                    break;
                }
                else
                {
                    if (response.UserList != null)
                    {
                        totalMinutes += response.UserList.Sum(s => (GetMinustes(s.JoinTs, s.LeaveTs)));
                    }
                }
            }

            liveRoomCallTimeInfo.TotalMinutes = Convert.ToInt32(totalMinutes);

            return liveRoomCallTimeInfo;
        }

        double GetMinustes(ulong startTime, ulong endTime)
        {
            return (new TimeSpan(Convert.ToInt64(endTime)) - new TimeSpan(Convert.ToInt64(startTime))).Duration().TotalMinutes;
        }

        /// <summary>
        /// 新增直播实时音视频通话时长信息
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool Insert(Entity.Domain.LiveRoomCallTimeInfo entity)
        {
            IEntityData entityData = new EntityData("LiveRoomCallTimeInfo");

            entityData.SetValue("InfoId", entity.InfoId);
            entityData.SetValue("LiveId", entity.LiveId);
            entityData.SetValue("TotalMinutes", entity.TotalMinutes);

            return _LiveRoomCallTimeInfo.Insert(entityData) != Guid.Empty;
        }
    }
}
