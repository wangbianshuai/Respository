using EntityDataService.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Entity
{
    [TableProperty(Name = "t_d_DataOperationTableLog", PrimaryKey = "TableLogId")]
    public class DataOperationTableLog : EntityModel, IEntity
    {
        /// <summary>
        /// TableLogId
        /// </summary>
        public Guid TableLogId { get; set; }
        /// <summary>
        /// 日志主键
        /// </summary>
        public Guid LogId { get; set; }
        /// <summary>
        /// 表名
        /// </summary>
        public string TableName { get; set; }
        /// <summary>
        /// 主键值
        /// </summary>
        public Guid PrimaryKey { get; set; }
        /// <summary>
        /// 日志类型 1：Insert,2:Update:3:Delete
        /// </summary>
        public byte LogType { get; set; }
    }
}
