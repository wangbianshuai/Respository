using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_RequestServiceLog", PrimaryKey = "LogId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class RequestServiceLog : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid LogId { get; set; }
        /// <summary> 
        /// 日志类型，1:成功、2:失败
        /// </summary> 
        public byte LogType { get; set; }
        /// <summary> 
        /// 服务接口ID
        /// </summary> 
        public Guid ServiceInterfaceId { get; set; }
        /// <summary> 
        /// 请求服务日志ID,重发请求记录失败请求日志ID
        /// </summary> 
        public Guid RequestServiceLogId { get; set; }
        /// <summary> 
        /// 请求报文
        /// </summary> 
        public string RequestContent { get; set; }
        /// <summary> 
        /// 响应报文
        /// </summary> 
        public string ResponseContent { get; set; }
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
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }

    [TableProperty(Name = "v_RequestServiceLog", PrimaryKey = "LogId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewRequestServiceLog : OperationLog
    {
        /// <summary>
        /// 消息接口名
        /// </summary>
        public string ServiceInterfaceName { get; set; }
        /// <summary>
        /// 重发次数
        /// </summary>
        public int ReSendCount { get; set; }
        /// <summary>
        /// 日志类型
        /// </summary>
        public string LogTypeName { get; set; }
        /// <summary>
        /// 是否重发记录
        /// </summary>
        public string IsReSendName { get; set; }
    }
}
