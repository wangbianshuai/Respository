using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace AbetAccount.Admin.Entity
{
    [TableProperty(Name = "t_AccountItem", PrimaryKey = "ItemId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class AccountItem : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid ItemId { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 序号
        /// </summary> 
        public int DisplayIndex { get; set; }
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
            validateList.Add(this.ValidateExists<AccountItem>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<AccountItem>("ItemId=@ItemId and Name=@Name", "true"));
            validateList.Add(this.ValidateExists<AccountItem>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));

        }
    }

    [TableProperty(Name = "v_AccountItem", PrimaryKey = "ItemId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewAccountItem : AccountItem
    {
    }
}
