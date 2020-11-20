using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageArrangeUser
{
    /// <summary>
    /// 获取红娘下用户条件类型列表请求
    /// </summary>
    public class GetMarriageArrangeUserConditionTypesByMatchmakerRequest : Request, IRequest
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
        /// 相亲安排Id
        /// </summary>
        public Guid MarriageArrangeId { get; set; }
    }

    /// <summary>
    /// 获取红娘下用户条件类型列表响应
    /// </summary>
    public class GetMarriageArrangeUserConditionTypesByMatchmakerResponse : Response, IResponse
    {
        /// <summary>
        /// 用户条件类型
        /// </summary>
        public List<MarriageUser.UserConditionType> DataList { get; set; }
    }
}
