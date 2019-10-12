using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Entity
{
    [TableProperty(Name = "v_ProductPurchaseSale", PrimaryKey = "ProductId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ProductPurchaseSale : EntityModel, IEntity
    {
        public DateTime SaleDate { get; set; }
        public Guid ProductId { get; set; }
        public int SaleYear { get; set; }
        public string SaleMonth { get; set; }
        public string SaleDay { get; set; }
        public decimal SaleAmount { get; set; }
        public decimal SaleBidAmount { get; set; }
        public decimal SaleDiscount { get; set; }
        public decimal SaleProfit { get; set; }
        public decimal PurchaseAmount { get; set; }
        public decimal PurhcaseDiscount { get; set; }
        public string ProductName { get; set; }
        public string ProductTypeName { get; set; }
        public string ProductBrandName { get; set; }
        public Guid ProductTypeId { get; set; }
        public Guid ProductBrandId { get; set; }
    }
}
