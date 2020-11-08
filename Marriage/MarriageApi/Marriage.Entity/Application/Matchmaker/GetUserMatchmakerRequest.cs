using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Matchmaker
{
    /// <summary>
    /// 获取用户红娘请求
    /// </summary>
    public class GetUserMatchmakerRequest : Request, IRequest
    {
    }

    /// <summary>
    /// 获取用户红娘响应
    /// </summary>
    public class GetUserMatchmakerResponse : Response, IResponse
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

    /// <summary>
    /// 红娘信息
    /// </summary>
    public class MatchmakerInfo2
    {
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
    }
}
