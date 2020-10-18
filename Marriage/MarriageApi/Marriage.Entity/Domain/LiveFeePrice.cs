using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 费用价格
    /// </summary>
    public class LiveFeePrice
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
