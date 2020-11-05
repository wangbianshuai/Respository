using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.WxUser
{
    /// <summary>
    /// 获取微信用户请求
    /// </summary>
    public class GetWxUserRequest : Request, IRequest
    {
        /// <summary>
        /// Code
        /// </summary>
        public string Code { get; set; }
    }

    /// <summary>
    /// 获取微信用户响应
    /// </summary>
    public class GetWxUserResponse : Response, IResponse
    {
        /// <summary>
        /// 用户数据
        /// </summary>
        public WxUser Data { get; set; }
    }

    /// <summary>
    /// 微信用户
    /// </summary>
    public class WxUser
    {
        /// <summary>
        /// 用户的唯一标识
        /// </summary>
        public string openid { get; set; }
        /// <summary>
        /// 用户昵称
        /// </summary>
        public string nickname { get; set; }
        /// <summary>
        /// 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
        /// </summary>
        public int sex { get; set; }
        /// <summary>
        /// 用户个人资料填写的省份
        /// </summary>
        public string province { get; set; }
        /// <summary>
        /// 普通用户个人资料填写的城市
        /// </summary>
        public string city { get; set; }
        /// <summary>
        /// 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效
        /// </summary>
        public string headimgurl { get; set; }
    }
}
