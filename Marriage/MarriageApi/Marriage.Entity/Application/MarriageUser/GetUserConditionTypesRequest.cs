using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser
{
    /// <summary>
    /// 获取用户条件类型列表请求
    /// </summary>
    public class GetUserConditionTypesRequest : Request, IRequest
    {
        /// <summary>
        /// 选择类型
        /// </summary>
        public byte SelectType { get; set; }
    }

    /// <summary>
    /// 获取用户条件类型列表响应
    /// </summary>
    public class GetUserConditionTypesResponse : Response, IResponse
    {
        /// <summary>
        /// 用户条件类型
        /// </summary>
        public List<UserConditionType> DataList { get; set; }
    }

    /// <summary>
    /// 状态信息
    /// </summary>
    public class UserConditionType
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
        /// 条件类型名称
        /// </summary> 
        public string ConditionTypeName { get; set; }
        /// <summary> 
        /// 用户选择值计数
        /// </summary> 
        public string UserItemCount { get; set; }
        /// <summary> 
        /// 完成百分比
        /// </summary> 
        public string Percentage { get; set; }
    }
}
