using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_User", PrimaryKey = "UserId")]
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
        /// 数据权限
        /// </summary>
        public int DataRight { get; set; }
        /// <summary>
        /// 所属权限组
        /// </summary>
        public int RightGroupId { get; set; }
        /// <summary>
        /// 手机
        /// </summary>
        public string Phone { get; set; }
        /// <summary>
        /// 电话
        /// </summary>
        public string Telephone { get; set; }
        /// <summary>
        /// 传真
        /// </summary>
        public string Tax { get; set; }
        /// <summary>
        /// 地址
        /// </summary>
        public string Address { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
        /// <summary> 
        /// 逻辑删除，1：删除,0:正常
        /// </summary> 
        public byte IsDelete { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<User>("IsDelete=0 and LoginName=@LoginName", "对不起，该登录名已存在！"));
            validateList.Add(this.ValidateExists<User>("IsDelete=0 and UserName=@UserName", "对不起，该用户名已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<User>("Id=@Id and LoginName=@LoginName", "true"));
            validateList.Add(this.ValidateExists<User>("IsDelete=0 and LoginName=@LoginName", "对不起，该登录名已存在！"));

            validateList.Add(this.ValidateExists<User>("Id=@Id and UserName=@UserName", "true"));
            validateList.Add(this.ValidateExists<User>("IsDelete=0 and UserName=@UserName", "对不起，该用户名已存在！"));
        }
    }

    [TableProperty(Name = "v_User", PrimaryKey = "UserId")]
    public class ViewUser : User
    {
        public long RowVersion { get; set; }
    }
}
