using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Matchmaker
{
    /// <summary>
    /// 获取平台红娘请求
    /// </summary>
    public class GetAppMatchmakerRequest : Request, IRequest
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        public Guid UserId { get; set; }
        /// <summary>
        /// 相亲安排Id
        /// </summary>
        public Guid MarriageArrangeId { get; set; }
    }

    /// <summary>
    /// 获取平台红娘响应
    /// </summary>
    public class GetAppMatchmakerResponse : Response, IResponse
    {
        /// <summary>
        /// 红娘信息
        /// </summary>
        public MatchmakerInfo2 MatchmakerInfo { get; set; }

        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 微信用户所在城市
        /// </summary> 
        public string City { get; set; }
        /// <summary> 
        /// 微信用户所在省份
        /// </summary> 
        public string Province { get; set; }
        /// <summary> 
        /// 地址
        /// </summary> 
        public string Address { get; set; }
        /// <summary> 
        /// 特点说明
        /// </summary> 
        public string Features { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
    }
}
