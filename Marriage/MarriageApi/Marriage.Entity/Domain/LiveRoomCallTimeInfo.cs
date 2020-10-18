using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 直播流量播放信息表
    /// </summary>
    public class LiveRoomCallTimeInfo
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid InfoId { get; set; }
        /// <summary> 
        /// 直播ID
        /// </summary> 
        public Guid LiveId { get; set; }
        /// <summary> 
        /// 总通话时长
        /// </summary> 
        public int TotalMinutes { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }

        /// <summary>
        /// 请求服务错误信息
        /// </summary>
        public string ErrorMessage { get; set; }
    }
}
