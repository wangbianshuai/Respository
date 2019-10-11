using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccess.Entity;

namespace PurchaseSale.Entity
{
    [TableProperty(Name = "t_SaleDetail", PrimaryKey = "Id")]
    [RequestMethod(IsDelete = false, IsPut = false,IsPost=false, IsGet=false)]
    public class SaleDetail : EntityModel, IEntity
    {
        /// <summary>
        /// 主键
        /// </summary>
        public Guid Id { get; set; }
        /// <summary>
        /// 销售Id
        /// </summary>
        public Guid SaleId { get; set; }
        /// <summary>
        /// 商品Id
        /// </summary>
        public Guid ProductId { get; set; }
        /// <summary>
        /// 价格
        /// </summary>
        public decimal SillingPrice { get; set; }
        /// <summary>
        /// 进价
        /// </summary>
        public decimal BidPrice { get; set; }
        /// <summary>
        /// 折扣
        /// </summary>
        public decimal Discount { get; set; }
        /// <summary>
        /// 数量
        /// </summary>
        public float Number { get; set; }
        /// <summary>
        /// 金额
        /// </summary>
        public decimal Amount { get; set; }
    }

    [TableProperty(Name = "v_SaleDetail", PrimaryKey = "Id")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewSaleDetail : SaleDetail
    {
        public string ProductTypeName { get; set; }
        public string ProductBrandName { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        public string ProductName { get; set; }
        /// <summary>
        /// 商品编号
        /// </summary>
        public string ProductCode { get; set; }
        /// <summary>
        /// 商品条形码
        /// </summary>
        public string ProductBarCode { get; set; }
        /// <summary>
        /// 型号
        /// </summary>
        public string Model { get; set; }
        /// <summary>
        /// 规格
        /// </summary>
        public string Spec { get; set; }
        /// <summary>
        /// 计量单位
        /// </summary>
        public string Unit { get; set; }
        /// <summary>
        /// 商品类型
        /// </summary>
        public Guid ProductTypeId { get; set; }
        /// <summary>
        /// 商品品牌
        /// </summary>
        public Guid ProductBrandId { get; set; }

        public byte SaleType { get; set; }
        public byte SaleStatus { get; set; }
        public string SaleTypeName { get; set; }
        public string SaleStatusName { get; set; }

        public string SaleCode { get; set; }
        public decimal Amount2 { get; set; }
        public decimal Discount2 { get; set; }
        public decimal BidAmount2 { get; set; }
        public decimal Profit { get; set; }
        public float ProfitRate { get; set; }

        public DateTime SaleDate { get; set; }
    }
}