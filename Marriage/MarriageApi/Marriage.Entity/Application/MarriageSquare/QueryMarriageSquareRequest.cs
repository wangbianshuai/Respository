using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageSquare
{
    /// <summary>
    /// 查询相亲广场请求
    /// </summary>
    public class QueryMarriageSquareRequest : Request, IRequest
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
    /// 查询相亲广场响应
    /// </summary>
    public class QueryMarriageSquareResponse : Response, IResponse
    {
        /// <summary>
        /// 数据列表
        /// </summary>
        public List<MarriageSquareUser> DataList { get; set; }
        /// <summary>
        /// 分页信息
        /// </summary>
        public PageInfo PageInfo { get; set; }
    }

    /// <summary>
    /// 相亲人员信息
    /// </summary>
    public class MarriageSquareUser
    {
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
        /// <summary>
        /// 玫瑰数
        /// </summary>
        public int RoseCount { get; set; }
        /// <summary>
        /// 收到玫瑰数
        /// </summary>
        public int RoseCount2 { get; set; }
    }
}
