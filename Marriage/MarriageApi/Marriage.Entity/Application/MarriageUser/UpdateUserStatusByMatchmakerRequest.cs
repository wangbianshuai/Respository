using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser
{
    /// <summary>
    /// 更新红娘下用户状态请求
    /// </summary>
    public class UpdateUserStatusByMatchmakerRequest : Request, IRequest
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }
        /// <summary> 
        /// 状态
        /// </summary> 
        public byte Status { get; set; }
        /// <summary> 
        /// 审核不通过原因
        /// </summary> 
        public string NoPassReason { get; set; }
    }

    /// <summary>
    /// 更新红娘下用户状态响应 
    /// </summary>
    public class UpdateUserStatusByMatchmakerResponse : Response, IResponse
    {
    }
}
