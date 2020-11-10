using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser
{
    /// <summary>
    /// 获取用户条件类型请求
    /// </summary>
    public class GetUserConditionTypeRequest : Request, IRequest
    {
        /// <summary>
        /// 选择类型
        /// </summary>
        public byte SelectType { get; set; }
        /// <summary>
        /// 条件类型Id
        /// </summary>
        public Guid ConditionTypeId { get; set; }
        /// <summary>
        /// 条件类型Id
        /// </summary>
        public Guid UserConditionTypeId { get; set; }
    }

    /// <summary>
    /// 获取用户条件类型响应
    /// </summary>
    public class GetUserConditionTypeResponse : Response, IResponse
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid UserConditionTypeId { get; set; }
        /// <summary> 
        /// 条件类型Id
        /// </summary> 
        public Guid ConditionTypeId { get; set; }
        /// <summary>
        /// 是否公开
        /// </summary>
        public byte IsPublic { get; set; }
        /// <summary>
        /// 选项集合
        /// </summary>
        public List<ConditionItem> Items { get; set; }
    }

    /// <summary>
    /// 条件选择
    /// </summary>
    public class ConditionItem {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid ItemId { get; set; }
        /// <summary> 
        /// 标题
        /// </summary> 
        public string Title { get; set; }
        /// <summary> 
        /// 数据类型
        /// </summary> 
        public string DataType { get; set; }
        /// <summary> 
        /// 数据源集合
        /// </summary> 
        public List<DataSourceItem> DataSourceItems { get; set; }
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
        /// 是否只读
        /// </summary>
        public bool IsReadOnly { get; set; }
    }

    /// <summary>
    /// 数据源
    /// </summary>
    public class DataSourceItem
    {
        /// <summary>
        /// 值
        /// </summary>
        public string value { get; set; }
        /// <summary>
        /// 文本
        /// </summary>
        public string text { get; set; }
    }
}
