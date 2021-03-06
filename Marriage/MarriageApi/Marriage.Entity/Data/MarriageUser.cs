﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 相亲用户信息表
    /// </summary>
    [TableProperty(Name = "t_MarriageUser", PrimaryKey = "UserId")]
    public class MarriageUser : EntityModel, IEntity
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
        /// 状态：0：待审核，1：审核通过，2：审核不通过，3：关闭
        /// </summary> 
        public byte Status { get; set; }
        /// <summary>
        /// 更新状态时间
        /// </summary>
        public DateTime UpdateStatusDate { get; set; }
        /// <summary> 
        /// 审核不通过原因
        /// </summary> 
        public string NoPassReason { get; set; }
        /// <summary> 
        /// 最近登录时间
        /// </summary> 
        public DateTime LastLoginDate { get; set; }
        /// <summary> 
        /// 登录Ip
        /// </summary> 
        public string LoginIp { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
        /// <summary> 
        /// 是否删除
        /// </summary> 
        public byte IsDelete { get; set; }
        /// <summary> 
        /// 创建人
        /// </summary> 
        public Guid CreateUser { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
        /// <summary> 
        /// 更新人
        /// </summary> 
        public Guid UpdateUser { get; set; }
        /// <summary> 
        /// 更新时间
        /// </summary> 
        public DateTime UpdateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }
}