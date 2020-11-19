using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageArrange
{
    /// <summary>
    /// 获取红娘下相亲安排请求
    /// </summary>
    public class GetMarriageArrangeByMatchmakerRequest : Request, IRequest
    {
        /// <summary>
        /// 获取相亲安排
        /// </summary>
        public Guid MarriageArrangeId { get; set; }
    }

    /// <summary>
    /// 获取红娘下相亲安排响应
    /// </summary>
    public class GetMarriageArrangeByMatchmakerResponse : Response, IResponse
    {
        /// <summary>
        /// 男方用户信息
        /// </summary>
        public MarriageUser.MarriageUser3 ManUserInfo { get; set; }

        /// <summary>
        /// 女方用户信息
        /// </summary>
        public MarriageUser.MarriageUser3 WomanUserInfo { get; set; }

        /// <summary>
        /// 状态信息
        /// </summary>
        public MarriageUser.StatusInfo StatusInfo { get; set; }
        /// <summary>
        /// 男方红娘
        /// </summary>
        public MatchmakerInfo4 ManMatchmaker { get; set; }
        /// <summary>
        /// 女方红娘
        /// </summary>
        public MatchmakerInfo4 WomanMatchmaker { get; set; }
        /// <summary>
        /// 平台红娘
        /// </summary>
        public MatchmakerInfo4 AppMatchmaker { get; set; }
        /// <summary>
        /// 相亲费用
        /// </summary>
        public string MarriageFee { get; set; }

    }

    /// <summary>
    /// 红娘信息
    /// </summary>
    public class MatchmakerInfo4
    {
        /// <summary>
        /// 红娘Id
        /// </summary>
        public Guid MatchmakerId { get; set; }
        /// <summary>
        /// 姓名
        /// </summary>
        public string Name { get; set; }
    }
}
