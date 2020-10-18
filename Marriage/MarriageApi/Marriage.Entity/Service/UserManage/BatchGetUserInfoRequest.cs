using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.UserManage
{
    /// <summary>
    /// 批量获取用户基本信息请求
    /// </summary>
    public class BatchGetUserInfoRequest : Request, IRequest
    {
        /// <summary>
        /// 用户列表
        /// </summary>
        public List<UserList> user_list { get; set; }
    }

    /// <summary>
    /// 批量获取用户基本信息响应
    /// </summary>
    public class BatchGetUserInfoResponse: Response, IResponse
    {
        /// <summary>
        /// 用户信息列表
        /// </summary>
        public List<UserInfo> User_Info_List { get; set; }
    }
    
    /// <summary>
    /// 用户信息
    /// </summary>
    public class UserInfo
    {
        /// <summary>
        /// 微信OpenId
        /// </summary>
        public string OpenId { get; set; }
        /// <summary> 
        /// 微信UnionId
        /// </summary> 
        public string UnionId { get; set; }
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
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
    }

    /// <summary>
    /// 用户列表
    /// </summary>
    public class UserList
    {
        /// <summary>
        /// 用户的标识，对当前公众号唯一
        /// </summary>
        public string openid { get; set; }
        /// <summary>
        /// 国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语，默认为zh-CN
        /// </summary>
        public string lang { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        public UserList()
        {
            lang = "zh_CN";
        }
    }
}
