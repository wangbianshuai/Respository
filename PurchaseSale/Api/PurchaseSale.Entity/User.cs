using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Entity
{
    [TableProperty(Name = "t_User", PrimaryKey = "UserId", NoSelectNames = "IsDelete,LoginPassword")]
    [RequestMethod(IsDelete = false)]
    public class User : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid UserId { get; set; }
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
        /// 逻辑删除，1：删除,0:正常
        /// </summary> 
        public byte IsDelete { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }

        public string CreateUser { get; set; }

        public string UpdateUser { get; set; }

        public string UpdateDate { get; set; }

        public string RowVersion { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<User>("IsDelete=0 and LoginName=@LoginName", "对不起，该登录名已存在！"));
            validateList.Add(this.ValidateExists<User>("IsDelete=0 and UserName=@UserName", "对不起，该用户名已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<User>("UserId=@UserId and LoginName=@LoginName", "true"));
            validateList.Add(this.ValidateExists<User>("IsDelete=0 and LoginName=@LoginName", "对不起，该登录名已存在！"));

            validateList.Add(this.ValidateExists<User>("UserId=@UserId and UserName=@UserName", "true"));
            validateList.Add(this.ValidateExists<User>("IsDelete=0 and UserName=@UserName", "对不起，该用户名已存在！"));
        }
    }

    [TableProperty(Name = "v_User", PrimaryKey = "UserId", NoSelectNames = "IsDelete,LoginPassword")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewUser : User
    {
    }
}
