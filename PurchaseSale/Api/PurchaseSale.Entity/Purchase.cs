using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Entity
{
    [TableProperty(Name = "t_Purchase", PrimaryKey = "PurchaseId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class Purchase : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid PurchaseId { get; set; }
        /// <summary>
        /// 采购单号
        /// </summary>
        public string PurchaseCode { get; set; }
        /// <summary>
        /// 采购单号
        /// </summary>
        public int PurchaseIntCode { get; set; }
        /// <summary>
        /// 采购人
        /// </summary>
        public Guid PurchaseUser { get; set; }
        /// <summary>
        /// 采购日期
        /// </summary>
        public DateTime PurchaseDate { get; set; }
        /// <summary>
        /// 采购类型，1：出货，2：退货
        /// </summary>
        public byte PurchaseType { get; set; }
        /// <summary>
        /// 物流费
        /// </summary>
        public decimal LogisticsFee { get; set; }
        /// <summary>
        /// 其他费
        /// </summary>
        public decimal OtherFee { get; set; }
        /// <summary>
        /// 折扣费
        /// </summary>
        public decimal DiscountFee { get; set; }
        /// <summary>
        /// 应收金额
        /// </summary>
        public decimal ShouldAmount { get; set; }
        /// <summary>
        /// 实收金额
        /// </summary>
        public decimal RealAmount { get; set; }
        /// <summary>
        /// 供应商
        /// </summary>
        public Guid SupplierId { get; set; }
        /// <summary>
        /// 状态,0:保存,1:提交,2:存档，3：作废            
        /// </summary>
        public byte PurchaseStatus { get; set; }
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

    [TableProperty(Name = "v_Purchase", PrimaryKey = "PurchaseId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewPurchase : Purchase
    {
        public string PurchaseUserName { get; set; }
        public string PurchaseTypeName { get; set; }
        public string PurchaseStatusName { get; set; }
        public decimal ShouldAmount2 { get; set; }
        public decimal RealAmount2 { get; set; }
        public decimal PurchaseAmount { get; set; }
        public string AmountType { get; set; }
        public decimal DueAmount { get; set; }
    }
}
