using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 直播流量播放信息表
    /// </summary>
    [TableProperty(Name = "t_LiveRoomCallTimeInfo", PrimaryKey = "InfoId")]
    public class LiveRoomCallTimeInfo : EntityModel, IEntity
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
    }
}
