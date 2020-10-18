using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity.Data
{
    /// <summary>
    /// 直播流量播放信息表
    /// </summary>
    [TableProperty(Name = "t_LiveStreamPlayInfo", PrimaryKey = "InfoId")]
    public class LiveStreamPlayInfo : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid InfoId { get; set; }
        /// <summary> 
        /// 日期，格式：YYYY-mm-dd
        /// </summary> 
        public string DayTime { get; set; }
        /// <summary> 
        /// 页数
        /// </summary> 
        public int PageNum { get; set; }
        /// <summary> 
        /// 流名称
        /// </summary> 
        public string StreamName { get; set; }
        /// <summary> 
        /// 总流量，单位: MB
        /// </summary> 
        public double TotalFlux { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
    }
}