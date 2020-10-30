using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_OperationLog", PrimaryKey = "LogId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class OperationLog : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid LogId { get; set; }
        /// <summary> 
        /// 日志类型
        /// </summary> 
        public string LogType { get; set; }
        /// <summary> 
        /// 日志路径
        /// </summary> 
        public string LogPath { get; set; }
        /// <summary> 
        /// 实体名
        /// </summary> 
        public string EntityName { get; set; }
        /// <summary> 
        /// 请求类型
        /// </summary> 
        public string RequestType { get; set; }
        /// <summary> 
        /// 方法名
        /// </summary> 
        public string MethodName { get; set; }
        /// <summary> 
        /// IP地址
        /// </summary> 
        public string IPAddress { get; set; }
        /// <summary> 
        /// 开始时间
        /// </summary> 
        public DateTime StartTime { get; set; }
        /// <summary> 
        /// 结束时间
        /// </summary> 
        public DateTime EndTime { get; set; }
        /// <summary> 
        /// 运行耗时
        /// </summary> 
        public long ElapsedMilliseconds { get; set; }
        /// <summary> 
        /// 操作人
        /// </summary> 
        public string OperationUser { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }

    [TableProperty(Name = "v_OperationLog", PrimaryKey = "LogId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewOperationLog : OperationLog
    {
        /// <summary>
        /// 用户名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 查看详细
        /// </summary>
        public string LookDetail { get; set; }
    }
}
