using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_AppUser", PrimaryKey = "UserId")]
    [RequestMethod(IsDelete = false)]
    public class AppUser : EntityModel, IEntity
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
        /// 登录名
        /// </summary> 
        public string LoginName { get; set; }
        /// <summary> 
        /// 登录密码
        /// </summary> 
        public string LoginPassword { get; set; }
        /// <summary> 
        /// 状态：1：正常，2：关闭
        /// </summary> 
        public byte Status { get; set; }
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

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<AppUser>("IsDelete=0 and LoginName=@LoginName", "对不起，该登录名已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<AppUser>("UserId=@UserId and LoginName=@LoginName", "true"));
            validateList.Add(this.ValidateExists<AppUser>("IsDelete=0 and LoginName=@LoginName", "对不起，该登录名已存在！"));
        }
    }

    [TableProperty(Name = "v_AppUser", PrimaryKey = "UserId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewAppUser : AppUser
    {
        public string StatusName { get; set; }
    }
}