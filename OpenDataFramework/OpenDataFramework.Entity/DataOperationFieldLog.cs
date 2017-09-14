using EntityDataService.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Entity
{
    [TableProperty(Name = "t_d_DataOperationFieldLog", PrimaryKey = "FieldLogId")]
    public class DataOperationFieldLog : EntityModel, IEntity
    {
        /// <summary>
        /// FieldLogId
        /// </summary>
        public Guid FieldLogId { get; set; }
        /// <summary>
        /// 表日志主键
        /// </summary>
        public Guid TableLogId { get; set; }
        /// <summary>
        /// 字段名
        /// </summary>
        public string FieldName { get; set; }
        /// <summary>
        /// 旧值
        /// </summary>
        public string OldValue { get; set; }
        /// <summary>
        /// 新值
        /// </summary>
        public string NewValue { get; set; }
    }
}
