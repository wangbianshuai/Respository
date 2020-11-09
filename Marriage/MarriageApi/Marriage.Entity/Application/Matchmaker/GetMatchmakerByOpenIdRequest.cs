using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Matchmaker
{
    /// <summary>
    /// 以微信OpenId获取红娘请求
    /// </summary>
    public class GetMatchmakerByOpenIdRequest : Request, IRequest
    {
        /// <summary>
        /// OpenId
        /// </summary>
        public string OpenId { get; set; }
    }

    /// <summary>
    /// 以微信OpenId获取红娘响应
    /// </summary>
    public class GetMatchmakerByOpenIdResponse : Response, IResponse
    {
    }
}
