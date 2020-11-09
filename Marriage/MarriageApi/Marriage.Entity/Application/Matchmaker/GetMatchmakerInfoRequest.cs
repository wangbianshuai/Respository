using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Matchmaker
{
    /// <summary>
    /// 获取红娘信息请求
    /// </summary>
    public class GetMatchmakerInfoRequest : Request, IRequest
    {
    }

    /// <summary>
    /// 获取红娘信息响应
    /// </summary>
    public class GetMatchmakerInfoResponse : Response, IResponse
    {
        /// <summary>
        /// 红娘信息
        /// </summary>
        public MatchmakerInfo MatchmakerInfo { get; set; }
    }

    /// <summary>
    /// 红娘信息
    /// </summary>
    public class MatchmakerInfo
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid MatchmakerId { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 微信OpenId
        /// </summary> 
        public string OpenId { get; set; }
        /// <summary> 
        /// 微信昵称
        /// </summary> 
        public string NickName { get; set; }
        /// <summary> 
        /// 微信红娘的性别，值为1时是男性，值为2时是女性，值为0时是未知
        /// </summary> 
        public byte Sex { get; set; }
        /// <summary> 
        /// 微信红娘所在城市
        /// </summary> 
        public string City { get; set; }
        /// <summary> 
        /// 微信红娘所在省份
        /// </summary> 
        public string Province { get; set; }
        /// <summary> 
        /// 微信红娘头像
        /// </summary> 
        public string HeadImgUrl { get; set; }
        /// <summary> 
        /// 身份证号码
        /// </summary> 
        public string IdCard { get; set; }
        /// <summary> 
        /// 手机
        /// </summary> 
        public string Phone { get; set; }
        /// <summary> 
        /// 家庭地址
        /// </summary> 
        public string Address { get; set; }
        /// <summary> 
        /// 特点说明
        /// </summary> 
        public string Features { get; set; }
    }
}
