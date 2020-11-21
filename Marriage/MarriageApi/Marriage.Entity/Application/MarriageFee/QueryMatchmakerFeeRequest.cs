using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageFee
{
    /// <summary>
    /// 查询红娘中介费明细请求
    /// </summary>
    public class QueryMatchmakerFeeRequest : Request, IRequest
    {
        /// <summary>
        /// 分页索引，从1开始
        /// </summary>
        public int PageIndex { get; set; }
        /// <summary>
        /// 分页大小
        /// </summary>
        public int PageSize { get; set; }
    }

    /// <summary>
    /// 查询红娘中介费明细响应
    /// </summary>
    public class QueryMatchmakerFeeResponse : Response, IResponse
    {
        /// <summary>
        /// 数据列表
        /// </summary>
        public List<MatchmakerFeeInfo> DataList { get; set; }
        /// <summary>
        /// 分页信息
        /// </summary>
        public PageInfo PageInfo { get; set; }
    }

    /// <summary>
    /// 相亲安排信息
    /// </summary>
    public class MatchmakerFeeInfo
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid DetailId { get; set; }
        /// <summary>
        /// 男方
        /// </summary>
        public string ManUserName { get; set; }
        /// <summary>
        /// 女方
        /// </summary>
        public string WomanUserName { get; set; }
        /// <summary>
        /// 男方头像
        /// </summary>
        public string ManHeadImgUrl { get; set; }
        /// <summary>
        /// 男方年龄
        /// </summary>
        public int ManAge { get; set; }
        /// <summary>
        /// 女方头像
        /// </summary>
        public string WomanHeadImgUrl { get; set; }
        /// <summary>
        /// 女方年龄
        /// </summary>
        public int WomanAge { get; set; }
        /// <summary>
        /// 费用日期
        /// </summary>
        public string FeeDate { get; set; }
        /// <summary>
        /// 总金额
        /// </summary>
        public string Amount { get; set; }
    }
}
