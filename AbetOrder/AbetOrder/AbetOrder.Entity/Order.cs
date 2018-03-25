using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccess.Entity;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_Order", PrimaryKey = "OrderId", NoSelectNames = "IsDelete")]
    public class Order : EntityModel, IEntity
    {
        public Guid OrderId { get; set; }
        public string OrderCode { get; set; }
        public byte OrderStatus { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string PaymentMehthod { get; set; }
        public decimal Amount { get; set; }
        public decimal ActualAmount { get; set; }
        public decimal PaidDeposit { get; set; }
        public decimal ShouldPayBalance { get; set; }
        public Guid CustomerId { get; set; }
        public string Remark { get; set; }
        public Guid CreateUser { get; set; }
        public Guid UpdateUser { get; set; }
        public DateTime UpdateDate { get; set; }
        public Guid SaleUser { get; set; }
        public byte IsDelete { get; set; }
        public DateTime CreateDate { get; set; }

        public long RowVersion { get; set; }
    }

    [TableProperty(Name = "v_Order", PrimaryKey = "OrderId", NoSelectNames = "IsDelete")]
    public class ViewOrder : Order
    {
    }

    [TableProperty(Name = "t_d_OrderImage", PrimaryKey = "Id")]
    public class OrderImage : EntityModel, IEntity
    {
        public Guid Id { get; set; }
        public string Remark { get; set; }
        public Guid OrderId { get; set; }
        public string ImageUrl { get; set; }
    }

    [TableProperty(Name = "t_d_OrderDetail", PrimaryKey = "OrderDetailId")]
    public class OrderDetail : EntityModel, IEntity
    {
        public Guid OrderDetailId { get; set; }
        public Guid OrderId { get; set; }
        public int DisplayIndex { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public double Area { get; set; }
        public decimal Price { get; set; }
        public double Number { get; set; }
        public decimal Amount { get; set; }
        public decimal ActualAmount { get; set; }
        public string Remark { get; set; }
    }

    [TableProperty(Name = "t_d_OrderDetailProcess", PrimaryKey = "Id")]
    public class OrderDetailProcess : EntityModel, IEntity
    {
        public Guid Id { get; set; }
        public Guid OrderDetailId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public double AmountPercent { get; set; }
        public decimal Amount { get; set; }
        public decimal ActualAmount { get; set; }
        public string Remark { get; set; }
    }
}