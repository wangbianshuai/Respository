using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_User", PrimaryKey = "OpenId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsGet = false, IsPut = false)]
    public class User : EntityModel, IEntity
    {
        /// <summary> 
        /// 微信OpenId
        /// </summary> 
        public string OpenId { get; set; }
        /// <summary> 
        /// App账号ID
        /// </summary> 
        public Guid AppAccountId { get; set; }
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

    [TableProperty(Name = "v_User", PrimaryKey = "OpenId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewUser : User
    {
        public string SexName { get; set; }
    }

    [TableProperty(Name = "t_User_UserTag", PrimaryKey = "Id")]
    [RequestMethod(IsDelete = false, IsPost = false, IsGet = false, IsPut = false)]
    public class UserUserTag : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid Id { get; set; }
        /// <summary> 
        /// 用户ID
        /// </summary> 
        public string OpenId { get; set; }
        /// <summary> 
        /// 用户标签ID
        /// </summary> 
        public Guid UserTagId { get; set; }
    }

    [TableProperty(Name = "v_User_UserTag", PrimaryKey = "OpenId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewUserUserTag : User
    {
        public string SexName { get; set; }
        /// <summary> 
        /// 用户标签ID
        /// </summary> 
        public Guid UserTagId { get; set; }
    }

    [TableProperty(Name = "v_User2", PrimaryKey = "OpenId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewUser2 : User
    {
        public string SexName { get; set; }
        /// <summary> 
        /// 用户标签集合
        /// </summary> 
        public string UserTagNames { get; set; }
    }

    [TableProperty(Name = "v_User_UserTag2", PrimaryKey = "OpenId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewUserUserTag2 : User
    {
        public string SexName { get; set; }
        /// <summary> 
        /// 用户标签ID
        /// </summary> 
        public Guid UserTagId { get; set; }
        /// <summary> 
        /// 用户标签集合
        /// </summary> 
        public string UserTagNames { get; set; }
    }
}