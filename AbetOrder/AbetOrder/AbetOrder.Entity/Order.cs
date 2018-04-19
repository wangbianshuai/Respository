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
        public int OrderIntCode { get; set; }
        public byte OrderStatus { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string OrderName { get; set; }
        public decimal ActualAmount { get; set; }
        public decimal PaidDeposit { get; set; }
        public double DiscountRate { get; set; }
        public decimal ProcessAmount { get; set; }
        public Guid CustomerId { get; set; }
        public string Remark { get; set; }
        public Guid CreateUser { get; set; }
        public Guid UpdateUser { get; set; }
        public DateTime UpdateDate { get; set; }
        public Guid FactoryId { get; set; }
        public byte IsDelete { get; set; }
        public DateTime CreateDate { get; set; }
        public string OrderPdfPath { get; set; }
        public string ProcessPdfPath { get; set; }
        public Guid OrderTemplateHtmlId { get; set; }
        public Guid ProcessTemplateHtmlId { get; set; }
        public string RowVersion { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<Order>("IsDelete=0 and OrderCode=@OrderCode", "对不起，该订单编号已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<Order>("OrderId=@OrderId and OrderCode=@OrderCode", "true"));
            validateList.Add(this.ValidateExists<Order>("IsDelete=0 and OrderCode=@OrderCode", "对不起，该订单编号已存在！"));
        }
    }

    [TableProperty(Name = "t_d_Order", PrimaryKey = "OrderId", NoSelectNames = "IsDelete")]
    public class ProcessOrder : Order
    {
        public string OrderName2 { get; set; }
    }

    [TableProperty(Name = "v_Order", PrimaryKey = "OrderId", NoSelectNames = "IsDelete")]
    public class ViewOrder : Order
    {
        public string OrderStatusName { get; set; }
        public string CreateUserName { get; set; }
        public string UpdateUserName { get; set; }
        public string CustomerName { get; set; }
        public byte DataRight { get; set; }
        public string OrderTemplateHtmlName { get; set; }
        public string ProcessTemplateHtmlName { get; set; }
        public decimal ProcessAmount2 { get; set; }
        public decimal CostAmount2 { get; set; }
        public string OrderName2 { get; set; }

        public decimal Amount { get; set; }
        public decimal ShouldPayBalance { get; set; }
        public decimal CostAmount { get; set; }
        public decimal ExtraCharge { get; set; }
        public decimal Profit { get; set; }
    }


    [TableProperty(Name = "v_Order2", PrimaryKey = "OrderId", NoSelectNames = "IsDelete")]
    public class ViewOrder2 : Order
    {
        public string OrderName2 { get; set; }
    }

    [TableProperty(Name = "v_ProcessOrder", PrimaryKey = "OrderId", NoSelectNames = "IsDelete")]
    public class ViewProcessOrder : Order
    {
        public string UpdateUserName { get; set; }
        public string CreateUserName { get; set; }
        public byte BillStatus { get; set; }
        public string BillStatusName { get; set; }
        public Guid CreateUser2 { get; set; }
        public string OrderName2 { get; set; }
    }

    [TableProperty(Name = "t_d_OrderImage", PrimaryKey = "Id")]
    public class OrderImage : EntityModel, IEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int DisplayIndex { get; set; }
        public Guid OrderId { get; set; }
        public byte FileType { get; set; }
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
        public double Thickness { get; set; }
        public decimal Price { get; set; }
        public double Number { get; set; }
        public decimal Amount { get; set; }
        public string Remark { get; set; }
        public byte DetailType { get; set; }
        public string FontColor { get; set; }
        public string FontSize { get; set; }
        public string FontFamily { get; set; }
        public byte IsBold { get; set; }
        public byte IsUnderline { get; set; }
    }

    [TableProperty(Name = "t_d_OrderRemark", PrimaryKey = "Id")]
    public class OrderRemark : EntityModel, IEntity
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public int DisplayIndex { get; set; }
        public string Remark { get; set; }
        public string FontColor { get; set; }
        public string FontSize { get; set; }
        public string FontFamily { get; set; }
        public byte IsBold { get; set; }
        public byte IsUnderline { get; set; }
    }
}