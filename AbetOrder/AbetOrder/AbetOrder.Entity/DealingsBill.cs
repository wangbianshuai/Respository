using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_DealingsBill", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    public class DealingsBill : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid Id { get; set; }
        /// <summary> 
        /// 数据ID
        /// </summary> 
        public Guid DataId { get; set; }
        /// <summary>
        /// 金额
        /// </summary>
        public decimal Amount { get; set; }
        /// <summary>
        /// 账目类型
        /// </summary>
        public Guid BillTypeId { get; set; }
        /// <summary>
        /// 创建人
        /// </summary>
        public Guid CreateUser { get; set; }
        /// <summary>
        /// 业务往来人
        /// </summary>
        public Guid DealingsUser { get; set; }
        /// <summary>
        /// 审核时间
        /// </summary>
        public DateTime ApproveDate { get; set; }
        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime UpdateDate { get; set; }
        /// <summary>
        /// 时间
        /// </summary>
        public DateTime BillDate { get; set; }
        /// <summary>
        /// 状态 0：未确认，1：已确认
        /// </summary>
        public byte BillStatus { get; set; }
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

    [TableProperty(Name = "v_DealingsBill", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    public class ViewDealingsBill : DealingsBill
    {
        public int IncomePayment { get; set; }
        public string IncomePaymentName { get; set; }
        public string CreateUserName2 { get; set; }
        public string DealingsUserName2 { get; set; }
        public string BillTypeName { get; set; }
        public decimal Amount2 { get; set; }
        public string BillStatusName { get; set; }
        public Guid DealingsUser2 { get; set; }
        public Guid CreateUser2 { get; set; }
    }

    [TableProperty(Name = "v_DealingsBillUser", PrimaryKey = "CreateUser")]
    public class ViewDealingsBillUser : EntityModel, IEntity
    {
        public Guid CreateUser { get; set; }
        public Guid DealingsUser { get; set; }
        public string DealingsUserName { get; set; }
    }
}
