﻿using OpenDataAccessCore.Entity;
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
        /// 客户Id
        /// </summary> 
        public Guid CustomerId { get; set; }
        /// <summary> 
        /// 账目类型
        /// </summary> 
        public Guid AccountTypeId { get; set; }
        /// <summary> 
        /// 是否收入，默认支出
        /// </summary> 
        public byte IsIncome { get; set; }
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

        public string IncomeOutlay { get; set; }
        /// <summary>
        /// 金额
        /// </summary>
        public float Amount2 { get; set; }
        /// <summary>
        /// 税额
        /// </summary>
        public float Tax2 { get; set; }

    }
}