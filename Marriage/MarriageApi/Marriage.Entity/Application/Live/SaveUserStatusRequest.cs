using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{
    /// <summary>
    /// 保存用户状态请求
    /// </summary>
    public class SaveUserStatusRequest : Request, IRequest
    {
        /// <summary>
        /// 直播ID
        /// </summary>
        public Guid LiveId { get; set; }
        /// <summary>
        /// 用户ID
        /// </summary>
        public string UserId { get; set; }
        /// <summary>
        /// 状态类型，1：禁言，2：踢出
        /// </summary>
        public byte StatusType { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public bool Status { get; set; }
    }

    /// <summary>
    /// 保存用户状态响应
    /// </summary>
    public class SaveUserStatusResponse : Response, IResponse
    {

    }
}
