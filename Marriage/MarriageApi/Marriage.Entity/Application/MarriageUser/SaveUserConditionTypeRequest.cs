using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser
{
    /// <summary>
    /// 保存用户条件类型请求
    /// </summary>
    public class SaveUserConditionTypeRequest : Request, IRequest
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

        /// <summary>
        /// 是否公开
        /// </summary>
        public byte IsPublic { get; set; }
        /// <summary>
        /// 选项集合
        /// </summary>
        public List<ConditionItem2> Items { get; set; }
    }

    /// <summary>
    /// 保存用户条件类型响应
    /// </summary>
    public class SaveUserConditionTypeResponse : Response, IResponse
    {
    }

    /// <summary>
    /// 条件选择
    /// </summary>
    public class ConditionItem2
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid ItemId { get; set; }
        /// <summary>
        /// 值
        /// </summary>
        public string Value { get; set; }
    }
}
