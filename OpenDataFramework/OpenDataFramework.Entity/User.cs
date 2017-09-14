using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EntityDataService.Entity;

namespace OpenDataFramework.Entity
{
    [TableProperty(Name = "t_d_User", PrimaryKey = "UserId")]
    public class User : EntityModel, IEntity
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string LoginName { get; set; }
        public string LoginPassword { get; set; }
        public Guid DepartId { get; set; }
        public int DataRight { get; set; }
        public DateTime LastLoginDate { get; set; }
        public byte IsDelete { get; set; }
        public DateTime CreateDate { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<User>("IsDelete=0 and LoginName=@LoginName", "对不起，该登录名已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<User>("UserId=@UserId and LoginName=@LoginName", "true"));
            validateList.Add(this.ValidateExists<User>("IsDelete=0 and LoginName=@LoginName", "对不起，该登录名已存在！"));
        }

        public static Dictionary<string, string> GetPropertyMapField()
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();

            dict.Add("用户名", "UserName");
            dict.Add("登录名", "LoginName");
            dict.Add("登录密码", "LoginPassword");
            dict.Add("部门", "DepartId");
            dict.Add("数据权限", "DataRight");
            dict.Add("创建时间", "CreateDate");

            return dict;
        }
    }
}