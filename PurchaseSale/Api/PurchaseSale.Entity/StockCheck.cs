using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccess.Entity;

namespace PurchaseSale.Entity
{
    [TableProperty(Name = "t_StockCheck", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPut = false)]
    public class StockCheck : EntityModel, IEntity
    {
        /// <summary>
        /// 主键
        /// </summary>
        public Guid Id { get; set; }
        /// <summary>
        /// 商品Id
        /// </summary>
        public Guid ProductId { get; set; }
        /// <summary>
        /// 应有库存
        /// </summary>
        public float ShouldStock { get; set; }
        /// <summary>
        /// 实有库存
        /// </summary>
        public float RealStock { get; set; }
        /// <summary>
        /// 盘点日期
        /// </summary>
        public DateTime CheckDate { get; set; }
        /// <summary>
        /// 更新人
        /// </summary>
        public Guid CheckUser { get; set; }
        /// <summary>
        /// 进价
        /// </summary>
        public decimal BidPrice { get; set; }
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

    [TableProperty(Name = "v_StockCheck", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewStockCheck : StockCheck
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

        public decimal LossAmount { get; set; }
    }
}