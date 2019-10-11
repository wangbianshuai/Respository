using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Entity
{
    [TableProperty(Name = "t_Sale", PrimaryKey = "SaleId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class Sale : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid SaleId { get; set; }
        /// <summary>
        /// 销售单号
        /// </summary>
        public string SaleCode { get; set; }
        /// <summary>
        /// 销售单号
        /// </summary>
        public int SaleIntCode { get; set; }
        /// <summary>
        /// 销售人
        /// </summary>
        public Guid SaleUser { get; set; }
        /// <summary>
        /// 销售日期
        /// </summary>
        public DateTime SaleDate { get; set; }
        /// <summary>
        /// 销售类型，1：出货，2：退货
        /// </summary>
        public byte SaleType { get; set; }
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
        /// 顾客姓名
        /// </summary>
        public string CustomerName { get; set; }
        /// <summary>
        /// 顾客手机
        /// </summary>
        public string CustomerPhone { get; set; }
        /// <summary>
        /// 销售状态,0:保存,1:提交,2:存档，3：作废            
        /// </summary>
        public byte SaleStatus { get; set; }
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

    [TableProperty(Name = "v_Sale", PrimaryKey = "SaleId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewSale : Sale
    {
        public string SaleUserName { get; set; }
        public string SaleTypeName { get; set; }
        public string SaleStatusName { get; set; }
        public decimal ShouldAmount2 { get; set; }
        public decimal RealAmount2 { get; set; }
        public decimal BidAmount { get; set; }
        public decimal SaleAmount { get; set; }
        public decimal Profit { get; set; }
        public decimal ProfitRate { get; set; }
        public string AmountType { get; set; }
    }
}
