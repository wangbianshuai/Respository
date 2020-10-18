using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 直播费用
    /// </summary>
    [TableProperty(Name = "v_LiveFee")]
    public class LiveFee : EntityModel, IEntity
    {
        /// <summary>
        /// 直播ID
        /// </summary>
        public Guid LiveId { get; set; }
        /// <summary>
        /// 直播编号
        /// </summary>
        public string LiveCode { get; set; }
        /// <summary>
        /// 直播名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 流名称
        /// </summary>
        public string StreamName { get; set; }
        /// <summary>
        /// 单价
        /// </summary>
        public decimal Price { get; set; }
        /// <summary>
        /// 总流量
        /// </summary>
        public double TotalFlux { get; set; }
        /// <summary>
        /// 总金额
        /// </summary>
        public double TotalAmount { get; set; }
    }
}