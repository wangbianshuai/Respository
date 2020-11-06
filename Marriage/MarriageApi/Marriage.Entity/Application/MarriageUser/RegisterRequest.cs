using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser
{
    /// <summary>
    /// 注册请求
    /// </summary>
    public class RegisterRequest : Request, IRequest
    {
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
        /// 微信用户所在城市
        /// </summary> 
        public string City { get; set; }
        /// <summary> 
        /// 微信用户所在省份
        /// </summary> 
        public string Province { get; set; }
        /// <summary> 
        /// 微信用户头像
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
        /// 现居住地
        /// </summary> 
        public string NowAddress { get; set; }
        /// <summary> 
        /// 公历生日
        /// </summary> 
        public DateTime Birthday { get; set; }
        /// <summary> 
        /// 出生时辰
        /// </summary> 
        public int BirthTime { get; set; }
        /// <summary> 
        /// 农历生日
        /// </summary> 
        public string LunarBirthday { get; set; }
        /// <summary> 
        /// 生辰八字
        /// </summary> 
        public string BirthEight { get; set; }
        /// <summary> 
        /// 所属红娘
        /// </summary> 
        public Guid MatchmakerId { get; set; }
        /// <summary> 
        /// 是否公开
        /// </summary> 
        public byte IsPublic { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
    }

    /// <summary>
    /// 注册响应
    /// </summary>
    public class RegisterResponse : Response, IResponse
    {
        /// <summary>
        /// 用户数据
        /// </summary>
        public UserInfo Data { get; set; }
    }
}
