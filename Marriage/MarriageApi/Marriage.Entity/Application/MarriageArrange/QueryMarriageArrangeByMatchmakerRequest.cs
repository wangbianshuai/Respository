using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageArrange
{
    /// <summary>
    /// 查询红娘下相亲安排请求
    /// </summary>
    public class QueryMarriageArrangeByMatchmakerRequest : Request, IRequest
    {
        /// <summary>
        /// 分页索引，从1开始
        /// </summary>
        public int PageIndex { get; set; }
        /// <summary>
        /// 分页大小
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        /// 类型
        /// </summary>
        public byte Type { get; set; }
    }

    /// <summary>
    /// 查询红娘下相亲安排响应
    /// </summary>
    public class QueryMarriageArrangeByMatchmakerResponse : Response, IResponse
    {
        /// <summary>
        /// 数据列表
        /// </summary>
        public List<MarriageArrangeInfo> DataList { get; set; }
        /// <summary>
        /// 分页信息
        /// </summary>
        public PageInfo PageInfo { get; set; }
    }

    /// <summary>
    /// 相亲安排信息
    /// </summary>
    public class MarriageArrangeInfo
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid MarriageArrangeId { get; set; }
        /// <summary> 
        /// 相亲时间
        /// </summary> 
        public string MarriageDate { get; set; }
        /// <summary> 
        /// 相亲地点
        /// </summary> 
        public string MarriageAddress { get; set; }
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
        public string ManAge { get; set; }
        /// <summary>
        /// 女方头像
        /// </summary>
        public string WomanHeadImgUrl { get; set; }
        /// <summary>
        /// 女方年龄
        /// </summary>
        public string WomanAge { get; set; }
    }
}
