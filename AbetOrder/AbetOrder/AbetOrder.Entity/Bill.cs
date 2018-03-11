using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_templatehtml", PrimaryKey = "Id")]
    public class Bill : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid Id { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary>
        /// 金额
        /// </summary>
        public decimal Amount { get; set; }
        /// <summary>
        /// 账目类型
        /// </summary>
        public Guid BillType { get; set; }
        /// <summary>
        /// 收入支出  -- 1: 收入，2：支出
        /// </summary>
        public byte IncomePayment { get; set; }
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
        /// 经手人
        /// </summary>
        public Guid BillUser { get; set; }
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
    }

    [TableProperty(Name = "v_Bill", PrimaryKey = "Id")]
    public class ViewBill : Bill 
    {
        public long RowVersion { get; set; }
    }
}
