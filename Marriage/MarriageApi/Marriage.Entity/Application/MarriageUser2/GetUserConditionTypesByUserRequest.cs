using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser2
{
    /// <summary>
    /// 获取用户下用户条件类型列表请求
    /// </summary>
    public class GetUserConditionTypesByUserRequest : Request, IRequest
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
        /// 类型，1：相亲广场用户，2：相亲安排用户
        /// </summary>
        public byte Type { get; set; }
    }

    /// <summary>
    /// 获取用户下用户条件类型列表响应
    /// </summary>
    public class GetUserConditionTypesByUserResponse : Response, IResponse
    {
        /// <summary>
        /// 用户条件类型
        /// </summary>
        public List<MarriageUser.UserConditionType> DataList { get; set; }
    }
}
