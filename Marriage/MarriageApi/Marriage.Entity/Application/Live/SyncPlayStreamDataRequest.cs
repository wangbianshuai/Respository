using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{

    /// <summary>
    /// 同步播放流数据请求
    /// </summary>
    public class SyncPlayStreamDataRequest : Request, IRequest
    {
        /// <summary>
        /// 日期，格式：YYYY-mm-dd。第二天凌晨3点出昨天的数据，建议在这个时间点之后查询最新数据。
        /// </summary>
        public string DayTime { get; set; }
        /// <summary>
        /// 播放域名。
        /// </summary>
        public string PlayDomain { get; set; }
        /// <summary>
        /// 页号，范围[1,1000]，默认值是1。（必填）
        /// </summary>
        public ulong PageNum { get; set; }
    }

    /// <summary>
    /// 同步播放流数据响应
    /// </summary>
    public class SyncPlayStreamDataResponse : Response, IResponse
    {
        /// <summary>
        /// 总数量。
        /// </summary>
        public ulong TotalNum { get; set; }
        /// <summary>
        /// 总页数。
        /// </summary>
        public ulong TotalPage { get; set; }
        /// <summary>
        /// 当前数据所处页码。
        /// </summary>
        public ulong PageNum { get; set; }
    }
}
