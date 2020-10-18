using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 直播流量播放信息
    /// </summary>
    public class LiveStreamPlayInfo : ILiveStreamPlayInfo
    {
        public Data.ILiveStreamPlayInfo _LiveStreamPlayInfo { get; set; }

        /// <summary>
        /// 保存流量数据
        /// </summary>
        /// <param name="dataInfoList"></param>
        /// <param name="dayTime"></param>
        /// <param name="pageNum"></param>
        /// <returns></returns>
        public void SaveStreamPlayInfo(List<Entity.Service.LiveCloud.PlayDataInfoByStream> dataInfoList, string dayTime, ulong pageNum)
        {
            if (string.IsNullOrEmpty(dayTime)) dayTime = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd");
            pageNum = pageNum == 0 ? 1 : pageNum;

            _LiveStreamPlayInfo.DeleteByDayTimeAndPageNum(dayTime, Convert.ToInt32(pageNum));

            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            Dictionary<string, object> dict = null;

            dataInfoList.ForEach(d =>
            {
                dict = new Dictionary<string, object>();
                dict.Add("DayTime", dayTime);
                dict.Add("PageNum", Convert.ToInt32(pageNum));
                dict.Add("StreamName", d.StreamName);
                dict.Add("TotalFlux", d.TotalFlux);

                dictList.Add(dict);
            });

            _LiveStreamPlayInfo.BulkCopyInsert(dictList);
        }
    }
}
