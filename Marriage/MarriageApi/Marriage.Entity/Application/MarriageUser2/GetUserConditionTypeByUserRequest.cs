using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser2
{
    /// <summary>
    /// 获取用户下用户条件类型请求
    /// </summary>
    public class GetUserConditionTypeByUserRequest : Request, IRequest
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }
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
        /// 类型，1：相亲广场用户，2：相亲安排用户
        /// </summary>
        public byte Type { get; set; }
    }

    /// <summary>
    /// 获取用户下用户条件类型响应
    /// </summary>
    public class GetUserConditionTypeByUserResponse : Response, IResponse
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
        public List<MarriageUser.ConditionItem> Items { get; set; }
    }
}
