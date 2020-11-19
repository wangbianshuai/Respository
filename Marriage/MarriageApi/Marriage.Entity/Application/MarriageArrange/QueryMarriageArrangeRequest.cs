using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageArrange
{
    /// <summary>
    /// 查询相亲安排请求
    /// </summary>
    public class QueryMarriageArrangeRequest : Request, IRequest
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
    /// 查询相亲安排响应
    /// </summary>
    public class QueryMarriageArrangeResponse : Response, IResponse
    {
        /// <summary>
        /// 数据列表
        /// </summary>
        public List<MarriageArrangeUser> DataList { get; set; }
        /// <summary>
        /// 分页信息
        /// </summary>
        public PageInfo PageInfo { get; set; }
    }

    /// <summary>
    /// 相亲人员信息
    /// </summary>
    public class MarriageArrangeUser
    {
        /// <summary>
        /// 相亲安排Id
        /// </summary>
        public Guid MarriageArrangeId { get; set; }
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }
        /// <summary> 
        /// 微信昵称
        /// </summary> 
        public string NickName { get; set; }
        /// <summary> 
        /// 微信用户头像
        /// </summary> 
        public string HeadImgUrl { get; set; }
        /// <summary> 
        /// 个性签名
        /// </summary> 
        public string Remark { get; set; }
        /// <summary>
        /// 年龄
        /// </summary>
        public int Age { get; set; }
    }
}
