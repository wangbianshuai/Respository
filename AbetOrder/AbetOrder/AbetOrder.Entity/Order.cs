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
        public string OrderName { get; set; }
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
        public string OrderPdfPath { get; set; }
        public string ProcessPdfPath { get; set; }
        public Guid OrderTemplateHtmlId { get; set; }
        public Guid ProcessTemplateHtmlId { get; set; }
        public string RowVersion { get; set; }
    }

    [TableProperty(Name = "v_Order", PrimaryKey = "OrderId", NoSelectNames = "IsDelete")]
    public class ViewOrder : Order
    {
        public string OrderStatusName { get; set; }
        public string CreateUserName { get; set; }
        public string UpdateUserName { get; set; }
        public string SaleUserName { get; set; }
        public int DataRight { get; set; }
        public string CustomerName { get; set; }
        public string OrderTemplateHtmlName { get; set; }
        public string ProcessTemplateHtmlName { get; set; }
    }

    [TableProperty(Name = "v_ProcessOrder", PrimaryKey = "OrderId", NoSelectNames = "IsDelete")]
    public class ViewProcessOrder : Order
    {
        public string UpdateUserName { get; set; }
        public string SaleUserName { get; set; }
        public int DataRight { get; set; }
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
        public string ColorCode { get; set; }
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

    [TableProperty(Name = "v_OrderName", PrimaryKey = "OrderName")]
    public class ViewOrderName : EntityModel, IEntity
    {
        public int OrderName { get; set; }
    }

    [TableProperty(Name = "t_d_OrderProperty", PrimaryKey = "Id")]
    public class OrderProperty : EntityModel, IEntity
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }

    [TableProperty(Name = "t_d_OrderDetailProperty", PrimaryKey = "Id")]
    public class OrderDetailProperty : EntityModel, IEntity
    {
        public Guid Id { get; set; }
        public Guid OrderDetailId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }
}