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
        /// <summary> 
        /// 创建人
        /// </summary> 
        public string CreateUser { get; set; }
        /// <summary>
        /// 订单
        /// </summary>
        public Guid OrderId { get; set; }
        /// <summary> 
        /// 路径
        /// </summary> 
        public string PdfPath { get; set; }
        ///  -- 1:订单，2：加工单
        /// </summary> 
        public byte PdfType { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
    }
}
