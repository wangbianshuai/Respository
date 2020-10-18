using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 直播流量播放信息
    /// </summary>
    public interface ILiveStreamPlayInfo
    {
        /// <summary>
        /// 保存流量数据
        /// </summary>
        /// <param name="dataInfoList"></param>
        /// <param name="dayTime"></param>
        /// <param name="pageNum"></param>
        /// <returns></returns>
        void SaveStreamPlayInfo(List<Entity.Service.LiveCloud.PlayDataInfoByStream> dataInfoList, string dayTime, ulong pageNum);
    }
}
