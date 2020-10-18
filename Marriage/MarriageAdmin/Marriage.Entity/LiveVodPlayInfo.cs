using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_LiveVodPlayInfo", PrimaryKey = "InfoId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class LiveVodPlayInfo : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid InfoId { get; set; }
        /// <summary> 
        /// 文件ID，格式：YYYY-mm-dd
        /// </summary> 
        public string FileId { get; set; }
        /// <summary> 
        /// 日期，格式：YYYY-mm-dd
        /// </summary> 
        public DateTime DayTime { get; set; }
        /// <summary> 
        /// 总流量，单位: MB
        /// </summary> 
        public double TotalFlux { get; set; }
        /// <summary> 
        /// 响应状态，1：成功，2：失败
        /// </summary> 
        public byte ResponseStatus { get; set; }
        /// <summary> 
        /// 响应报文
        /// </summary> 
        public string ResponseContent { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
    }

    [TableProperty(Name = "v_LiveVodPlayInfo", PrimaryKey = "InfoId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewLiveVodPlayInfo : LiveVodPlayInfo
    {
        /// <summary>
        /// 直播名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 直播编号
        /// </summary>
        public string LiveCode { get; set; }
        /// <summary>
        /// 响应状态名称
        /// </summary>
        public string ResponseStatusName { get; set; }
    }

    [TableProperty(Name = "v_LiveVodPlaySyncRecord", PrimaryKey = "DayTime")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewLiveVodPlaySyncRecord : EntityModel, IEntity
    {
        /// <summary> 
        /// 日期，格式：YYYY-mm-dd
        /// </summary> 
        public DateTime DayTime { get; set; }
        /// <summary>
        /// 文件数
        /// </summary>
        public int RecordCount { get; set; }
        /// <summary>
        /// 成功数
        /// </summary>
        public int SucceedCount { get; set; }
        /// <summary>
        /// 失败数
        /// </summary>
        public int FailedCount { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
    }
}