using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace AbetAccount.Admin.Entity
{
    [TableProperty(Name = "t_AccountBill", PrimaryKey = "BillId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class AccountBill : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid BillId { get; set; }
        /// <summary> 
        /// 账户类别
        /// </summary> 
        public Guid AccountCategoryId { get; set; }
        /// <summary> 
        /// 账户项目
        /// </summary> 
        public Guid AccountItemId { get; set; }
        /// <summary> 
        /// 收支
        /// </summary> 
        public byte  IncomeOutlay{ get; set; }
        /// <summary>
        /// 金额
        /// </summary>
        public float Amount { get; set; }
        /// <summary>
        /// 税额
        /// </summary>
        public float Tax { get; set; }
        /// <summary>
        /// 日期
        /// </summary>
        public DateTime BillDate { get; set; }
        /// <summary> 
        /// 经手人
        /// </summary> 
        public Guid BillUser { get; set; }
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

    [TableProperty(Name = "v_AccountBill", PrimaryKey = "BillId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewAccountBill : AccountBill
    {

        public string IncomeOutlayName { get; set; }
        /// <summary>
        /// 金额
        /// </summary>
        public float Amount2 { get; set; }
        /// <summary>
        /// 税额
        /// </summary>
        public float Tax2 { get; set; }

        public string AccountTypeName { get; set; }

        public string AccountItemName { get; set; }

        public string AccountCategoryName { get; set; }

        public string BillUserName { get; set; }

        public string CustomerName { get; set; }

        public string CreateUserName { get; set; }

    }
}
