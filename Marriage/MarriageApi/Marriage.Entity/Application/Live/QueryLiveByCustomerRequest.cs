using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{
    /// <summary>
    /// 查询客户直播列表请求
    /// </summary>
    public class QueryLiveByCustomerRequest : Request, IRequest
    {
        /// <summary> 
        /// 客户ID
        /// </summary> 
        public string CustomerId { get; set; }
        /// <summary>
        /// 活动UID
        /// </summary>
        public string ActivityUID { get; set; }
        /// <summary>
        /// 分页索引，从1开始
        /// </summary>
        public int PageIndex { get; set; }
        /// <summary>
        /// 分页大小
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        /// 是否需获取分页信息
        /// </summary>
        public bool IsPageInfo { get; set; }
        /// <summary>
        /// 关键字
        /// </summary>
        public string Keyword { get; set; }
        /// <summary>
        /// 开始日期
        /// </summary>
        public DateTime StartDate { get; set; }
        /// <summary>
        /// 结束日期
        /// </summary>
        public DateTime EndDate { get; set; }
        /// <summary>
        /// 排序
        /// </summary>
        public OrderByType OrderByType { get; set; }
    }

    /// <summary>
    /// 查询客户直播列表响应
    /// </summary>
    public class QueryLiveByCustomerResponse : Response, IResponse
    {
        /// <summary>
        /// 直播数据列表
        /// </summary>
        public List<LiveData> DataList { get; set; }
        /// <summary>
        /// 分页信息
        /// </summary>
        public PageInfo PageInfo { get;set;}
    }
}
