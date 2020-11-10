using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser
{
    /// <summary>
    /// 查询红娘下相亲人员列表请求
    /// </summary>
    public class QueryUsersByMatchmakerRequest : Request, IRequest
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
        /// 状态
        /// </summary>
        public byte Status { get; set; }
        /// <summary>
        ///  性别
        /// </summary>
        public string Sex { get; set; }
    }

    /// <summary>
    /// 查询红娘下相亲人员列表响应
    /// </summary>
    public class QueryUsersByMatchmakerResponse : Response, IResponse
    {
        /// <summary>
        /// 数据列表
        /// </summary>
        public List<MarriageUser3> DataList { get; set; }
        /// <summary>
        /// 分页信息
        /// </summary>
        public PageInfo PageInfo { get; set; }
    }

    /// <summary>
    /// 相亲人员信息
    /// </summary>
    public class MarriageUser3
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
        /// 手机
        /// </summary> 
        public string Phone { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public byte Sex { get; set; }
        /// <summary>
        /// 年龄
        /// </summary>
        public int Age { get; set; }
    }
}
