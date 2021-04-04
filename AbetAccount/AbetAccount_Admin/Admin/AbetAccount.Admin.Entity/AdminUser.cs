using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace AbetAccount.Admin.Entity
{
    [TableProperty(Name = "t_AdminUser", PrimaryKey = "UserId", NoSelectNames = "IsDelete,LoginPassword")]
    [RequestMethod(IsDelete = false)]
    public class AdminUser : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid UserId { get; set; }
        /// <summary> 
        /// App账号ID
        /// </summary> 
        public Guid AppAccountId { get; set; }
        /// <summary> 
        /// 用户名
        /// </summary> 
        public string UserName { get; set; }
        /// <summary> 
        /// 登录名
        /// </summary> 
        public string LoginName { get; set; }
        /// <summary> 
        /// 登录密码
        /// </summary> 
        public string LoginPassword { get; set; }
        /// <summary> 
        /// 最近登录时间
        /// </summary> 
        public DateTime LastLoginDate { get; set; }
        /// <summary> 
        /// 是否管理员
        /// </summary> 
        public byte IsAdmin { get; set; }
        /// <summary> 
        /// 是否删除
        /// </summary> 
        public byte IsDelete { get; set; }
        /// <summary>
        /// 账目类型集合，以逗号隔开
        /// </summary>
        public string AccountTypes { get; set; }
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
            validateList.Add(this.ValidateExists<AdminUser>("IsDelete=0 and LoginName=@LoginName", "对不起，该登录名已存在！"));
            validateList.Add(this.ValidateExists<AdminUser>("IsDelete=0 and UserName=@UserName", "对不起，该用户名已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<AdminUser>("UserId=@UserId and LoginName=@LoginName", "true"));
            validateList.Add(this.ValidateExists<AdminUser>("IsDelete=0 and LoginName=@LoginName", "对不起，该登录名已存在！"));

            validateList.Add(this.ValidateExists<AdminUser>("UserId=@UserId and UserName=@UserName", "true"));
            validateList.Add(this.ValidateExists<AdminUser>("IsDelete=0 and UserName=@UserName", "对不起，该用户名已存在！"));
        }
    }

    [TableProperty(Name = "v_AdminUser", PrimaryKey = "UserId", NoSelectNames = "IsDelete,LoginPassword")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewAdminUser : AdminUser
    {
        public string IsAdminName { get; set; }
    }
}