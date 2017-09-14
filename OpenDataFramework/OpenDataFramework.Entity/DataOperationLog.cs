using EntityDataService.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Entity
{
    [TableProperty(Name = "t_d_DataOperationLog", PrimaryKey = "LogId")]
    public class DataOperationLog : EntityModel, IEntity
    {
        /// <summary>
        /// LogId
        /// </summary>
        public Guid LogId { get; set; }
        /// <summary>
        /// 操作名称
        /// </summary>
        public string OperationName { get; set; }
        /// <summary>
        /// 实体名
        /// </summary>
        public string EntityName { get; set; }
        /// <summary>
        /// 员工号
        /// </summary>
        public Guid OperationUser { get; set; }
        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 方法名
        /// </summary>
        public string MethodName { get; set; }
        /// <summary>
        /// 客户端IP
        /// </summary>
        public string OperationIP { get; set; }
        /// <summary>
        /// 操作时间
        /// </summary>
        public DateTime CreateDate { get; set; }
    }

    [TableProperty(Name = "v_DataOperationLog", PrimaryKey = "LogId")]
    public class ViewDataOperationLog : DataOperationLog
    {
        /// <summary>
        /// TableLogId
        /// </summary>
        public Guid TableLogId { get; set; }
        /// <summary>
        /// 表名
        /// </summary>
        public string TableName { get; set; }
        /// <summary>
        /// 主键值
        /// </summary>
        public Guid PrimaryKey { get; set; }
    }
}
