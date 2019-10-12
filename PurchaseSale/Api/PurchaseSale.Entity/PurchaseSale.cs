using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Entity
{
    [TableProperty(Name = "v_PurchaseSale", PrimaryKey = "SaleDate")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class PurchaseSale : EntityModel, IEntity
    {
        public DateTime SaleDate { get; set; }
        public int SaleYear { get; set; }
        public string SaleMonth { get; set; }
        public string SaleDay { get; set; }
        public decimal SaleAmount { get; set; }
        public decimal SaleBidAmount { get; set; }
        public decimal SaleDueAmount { get; set; }
        public decimal SaleProfit { get; set; }
        public decimal SaleRealAmount { get; set; }
        public decimal SaleShouldAmount { get; set; }
        public decimal PurchaseAmount { get; set; }
        public decimal PurchaseDueAmount { get; set; }
        public decimal PurchaseRealAmount { get; set; }
        public decimal PurchaseShouldAmount { get; set; }
        public decimal ShouldBalance { get; set; }
        public decimal RealBalance { get; set; }
    }
}
