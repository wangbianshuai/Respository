using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageSquare
{
    /// <summary>
    /// 更新相亲广场玫瑰数请求
    /// </summary>
    public class UpdateMarriageSquareRoseCountRequest : Request, IRequest
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }
        /// <summary> 
        /// 是否赠送
        /// </summary> 
        public bool IsSend { get; set; }
    }

    /// <summary>
    /// 更新相亲广场玫瑰数响应 
    /// </summary>
    public class UpdateMarriageSquareRoseCountResponse : Response, IResponse
    {
    }
}
