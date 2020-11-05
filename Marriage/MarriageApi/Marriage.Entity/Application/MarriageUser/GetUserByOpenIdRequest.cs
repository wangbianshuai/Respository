using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser
{
    /// <summary>
    /// 以微信OpenId获取用户请求
    /// </summary>
    public class GetUserByOpenIdRequest : Request, IRequest
    {
        /// <summary>
        /// OpenId
        /// </summary>
        public string OpenId { get; set; }
    }

    /// <summary>
    /// 以微信OpenId获取用户响应
    /// </summary>
    public class GetUserByOpenIdResponse : Response, IResponse
    {
        /// <summary>
        /// 用户数据
        /// </summary>
        public UserInfo Data { get; set; }
    }

    /// <summary>
    /// 用户信息
    /// </summary>
    public class UserInfo
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid UserId { get; set; }
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
        /// 微信用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
        /// </summary> 
        public byte Sex { get; set; }
        /// <summary> 
        /// 微信用户所在城市
        /// </summary> 
        public string City { get; set; }
        /// <summary> 
        /// 微信用户所在省份
        /// </summary> 
        public string Province { get; set; }
        /// <summary> 
        /// 微信用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
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
        /// 地址
        /// </summary> 
        public string Address { get; set; }
    }
}
