using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 直播费用价格信息表
    /// </summary>
    [TableProperty(Name = "t_LiveFeePrice", PrimaryKey = "FeeId")]
    public class LiveFeePrice : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid FeeId { get; set; }
        /// <summary> 
        /// 直播ID
        /// </summary> 
        public Guid LiveId { get; set; }
        /// <summary> 
        /// 费用类型，1：直播流量，2：点播流量，3：实时音视频时间
        /// </summary> 
        public byte FeeType { get; set; }
        /// <summary> 
        /// 单价(元/GB 或 元/分钟)
        /// </summary> 
        public decimal Price { get; set; }
    }
}