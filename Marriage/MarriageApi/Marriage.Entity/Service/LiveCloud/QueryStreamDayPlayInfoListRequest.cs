using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.LiveCloud
{

    /// <summary>
    /// 查询所有流的流量数据请求
    /// </summary>
    public class QueryStreamDayPlayInfoListRequest : Request, IRequest
    {
        /// <summary>
        /// SecretId
        /// </summary>
        public string SecretId { get; set; }
        /// <summary>
        /// SecretKey
        /// </summary>
        public string SecretKey { get; set; }
        /// <summary>
        /// 服务结节主机
        /// </summary>
        public string Endpoint { get; set; }
        /// <summary>
        /// 请求参数
        /// </summary>
        public QueryStreamDayPlayInfoListRequestParameter RequestParameter { get; set; }
    }

    /// <summary>
    /// 请求参数
    /// </summary>
    public class QueryStreamDayPlayInfoListRequestParameter
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
        /// 页号，范围[1,1000]，默认值是1。
        /// </summary>
        public ulong PageNum { get; set; }
        /// <summary>
        /// 每页个数，范围[100,1000]，默认值是1000。
        /// </summary>
        public ulong PageSize { get; set; }

    }
    /// <summary>
    /// 查询所有流的流量数据响应
    /// </summary>
    public class QueryStreamDayPlayInfoListResponse : Response, IResponse
    {
        /// <summary>
        /// 播放数据信息列表。
        /// </summary>
        public List<PlayDataInfoByStream> DataInfoList { get; set; }
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
        /// <summary>
        /// 每页个数。
        /// </summary>
        public ulong PageSize { get; set; }
    }

    /// <summary>
    /// 流维度的播放信息。
    /// </summary>
    public class PlayDataInfoByStream
    {
        /// <summary>
        /// 流名称。
        /// </summary>
        public string StreamName { get; set; }
        /// <summary>
        /// 总流量，单位: MB。
        /// </summary>
        public float TotalFlux { get; set; }

    }
}
