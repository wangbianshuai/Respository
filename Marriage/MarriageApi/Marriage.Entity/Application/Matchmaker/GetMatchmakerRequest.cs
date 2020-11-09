using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Matchmaker
{
    /// <summary>
    /// 获取红娘信息请求
    /// </summary>
    public class GetMatchmakerRequest : Request, IRequest
    {
    }

    /// <summary>
    /// 获取红娘信息响应
    /// </summary>
    public class GetMatchmakerResponse : Response, IResponse
    {
        /// <summary>
        /// 红娘信息
        /// </summary>
        public MatchmakerInfo3 MatchmakerInfo { get; set; }
        /// <summary>
        /// 状态信息
        /// </summary>
        public StatusInfo StatusInfo { get; set; }
    }

    /// <summary>
    /// 状态信息
    /// </summary>
    public class StatusInfo
    {
        /// <summary> 
        /// 状态：0：待审核，1：审核通过，2：审核不通过，3：关闭
        /// </summary> 
        public byte Status { get; set; }
        /// <summary> 
        /// 审核不通过原因
        /// </summary> 
        public string NoPassReason { get; set; }
    }

    /// <summary>
    /// 红娘信息
    /// </summary>
    public class MatchmakerInfo3
    {
        /// <summary> 
        /// 微信昵称
        /// </summary> 
        public string NickName { get; set; }
        /// <summary> 
        /// 微信红娘头像
        /// </summary> 
        public string HeadImgUrl { get; set; }
        /// <summary> 
        /// 手机
        /// </summary> 
        public string Phone { get; set; }
    }
}
