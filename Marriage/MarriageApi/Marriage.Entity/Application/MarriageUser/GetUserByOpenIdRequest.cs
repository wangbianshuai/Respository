using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUser
{
    /// <summary>
    /// 以微信OpenId获取用户请求
    /// </summary>
    public class GetUserByOpenIdRequest : Request, IRequest
    {
        /// <summary>
        /// OpenId
        /// </summary>
        public string OpenId { get; set; }
    }

    /// <summary>
    /// 以微信OpenId获取用户响应
    /// </summary>
    public class GetUserByOpenIdResponse : Response, IResponse
    {
    }
}
