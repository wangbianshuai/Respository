using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_OrderPdf", PrimaryKey = "Id")]
    public class OrderPdf : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid Id { get; set; }

        public Guid CreateUser { get; set; }

        public Guid OrderId { get; set; }
        /// <summary> 
        /// 路径
        /// </summary> 
        public string PdfPath { get; set; }
        /// <summary> 
        /// 失败信息
        /// </summary> 
        public string FailMessage { get; set; }
        /// 1：成功 2：失败
        /// </summary> 
        public byte GenStatus { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }

        ///  1:订单，2：加工单
        /// </summary> 
        public byte PdfType { get; set; }
    }

    [TableProperty(Name = "v_OrderPdf", PrimaryKey = "Id")]
    public class ViewOrderPdf : OrderPdf
    {
        public int FailId { get; set; }

        public string CreateUserName { get; set; }

        public byte DataRight { get; set; }

        public string GenStatusName { get; set; }

        public string PdfTypeName { get; set; }

        public string OrderName2 { get; set; }
    }
}
