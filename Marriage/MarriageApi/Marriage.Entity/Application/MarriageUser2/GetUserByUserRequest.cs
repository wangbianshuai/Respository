using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser2
{
    /// <summary>
    /// 获取用户下用户信息请求
    /// </summary>
    public class GetUserByUserRequest : Request, IRequest
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }
        /// <summary>
        /// 类型，1：相亲广场用户，2：相亲安排用户
        /// </summary>
        public byte Type { get; set; }
    }

    /// <summary>
    /// 获取用户下用户信息响应
    /// </summary>
    public class GetUserByUserResponse : Response, IResponse
    {
        /// <summary>
        /// 用户信息
        /// </summary>
        public MarriageUser4 UserInfo { get; set; }

        /// <summary>
        /// 状态信息
        /// </summary>
        public MarriageUser.StatusInfo StatusInfo { get; set; }
    }

    /// <summary>
    /// 相亲人员信息
    /// </summary>
    public class MarriageUser4
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
        /// 个性签名
        /// </summary> 
        public string Remark { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public byte Sex { get; set; }
        /// <summary>
        /// 年龄
        /// </summary>
        public int Age { get; set; }
        /// <summary>
        /// 玫瑰数
        /// </summary>
        public int RoseCount { get; set; }
        /// <summary>
        /// 收到玫瑰数
        /// </summary>
        public int RoseCount2 { get; set; }
    }
}
