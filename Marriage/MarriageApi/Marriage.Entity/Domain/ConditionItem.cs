﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 条件选项
    /// </summary>
    public class ConditionItem
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid ItemId { get; set; }
        /// <summary> 
        /// 标题
        /// </summary> 
        public string Title { get; set; }
        /// <summary> 
        /// 性别，1：男生，2：女生
        /// </summary> 
        public byte Sex { get; set; }
        /// <summary> 
        /// 数据类型
        /// </summary> 
        public string DataType { get; set; }
        /// <summary> 
        /// 数据源ID
        /// </summary> 
        public Guid DataSourceId { get; set; }
        /// <summary> 
        /// 是否单选，1：是
        /// </summary> 
        public byte IsSingle { get; set; }
        /// <summary> 
        /// 是否区间，1：是，一般数据类型为数值
        /// </summary> 
        public byte IsInterval { get; set; }
        /// <summary> 
        /// 显示顺序
        /// </summary> 
        public int DisplayIndex { get; set; }
        /// <summary>
        /// 值
        /// </summary>
        public string Value { get; set; }

        /// <summary> 
        /// 数据源集合
        /// </summary> 
        public List<DataSourceItem> DataSourceItems { get; set; }
    }
}
