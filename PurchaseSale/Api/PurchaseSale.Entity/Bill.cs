using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Entity
{
    [TableProperty(Name = "t_Bill", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class Bill : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid Id { get; set; }
        /// <summary>
        /// 金额
        /// </summary>
        public decimal Amount { get; set; }
        /// <summary>
        /// 收入支出  -- 1: 收入，2：支出
        /// </summary>
        public byte IncomePayment { get; set; }
        /// <summary>
        /// 业务数据ID
        /// </summary>
        public Guid DataId { get; set; }
        /// <summary>
        /// 数据类型  -- 1:采购，2：销售
        /// </summary>
        public byte DataType { get; set; }
        /// <summary>
        /// 账目类型
        /// </summary>
        public Guid BillTypeId { get; set; }
        /// <summary>
        /// 创建人
        /// </summary>
        public Guid CreateUser { get; set; }
        /// <summary>
        /// 更新人
        /// </summary>
        public Guid UpdateUser { get; set; }
        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime UpdateDate { get; set; }
        /// <summary>
        /// 时间
        /// </summary>
        public DateTime BillDate { get; set; }
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

        public string RowVersion { get; set; }
    }

    [TableProperty(Name = "v_Bill", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewBill : Bill
    {
        public string IncomePaymentName { get; set; }
        public decimal Amount2 { get; set; }
        public string BillTypeName { get; set; }
        public string DataCode { get; set; }
        public string DataPageUrl { get; set; }
        public string CreateUserName { get; set; }
    }
}
