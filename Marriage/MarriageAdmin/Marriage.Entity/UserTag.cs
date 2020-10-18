using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_UserTag", PrimaryKey = "UserTagId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class UserTag : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid UserTagId { get; set; }
        /// <summary> 
        /// App账号ID
        /// </summary> 
        public Guid AppAccountId { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
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
            validateList.Add(this.ValidateExists<UserTag>("IsDelete=0 and Name=@Name and AppAccountId=@AppAccountId", "对不起，该名称已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<UserTag>("UserTagId=@UserTagId and Name=@Name", "true"));
            validateList.Add(this.ValidateExists<UserTag>("IsDelete=0 and Name=@Name and AppAccountId=@AppAccountId", "对不起，该名称已存在！"));
        }
    }

    [TableProperty(Name = "v_UserTag", PrimaryKey = "UserTagId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewUserTag : UserTag
    {
    }
}
