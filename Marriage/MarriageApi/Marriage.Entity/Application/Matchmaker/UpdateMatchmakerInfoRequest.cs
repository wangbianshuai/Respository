using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Matchmaker
{
    /// <summary>
    /// 更新红娘信息请求
    /// </summary>
    public class UpdateMatchmakerInfoRequest : Request, IRequest
    {
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 微信昵称
        /// </summary> 
        public string NickName { get; set; }
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

    /// <summary>
    /// 更新红娘信息响应
    /// </summary>
    public class UpdateMatchmakerInfoResponse : Response, IResponse
    {
    }
}
