using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 直播流量播放信息
    /// </summary>
    public interface ILiveStreamPlayInfo
    {
        /// <summary>
        /// 以日期和页码删除数据
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        bool DeleteByDayTimeAndPageNum(string dayTime, int pageNum);

        /// <summary>
        /// 批量插入
        /// </summary>
        /// <param name="dictList"></param>
        /// <returns></returns>
        void BulkCopyInsert(List<Dictionary<string, object>> dictList);
    }
}
