using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.LeanCloud
{
    /// <summary>
    /// 创建聊天室请求
    /// </summary>
    public class CreateChatRoomRequest : Request, IRequest
    {
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// App ID
        /// </summary>
        public string AppId { get; set; }
        /// <summary>
        /// Rest Api
        /// </summary>
        public string ServiceUrl { get; set; }
        /// <summary>
        /// Master key
        /// </summary>
        public string MasterKey { get; set; }
    }

    /// <summary>
    /// 创建聊天室响应
    /// </summary>
    public class CreateChatRoomResponse : Response, IResponse
    {
        /// <summary>
        /// object Id
        /// </summary>
        public string objectId { get; set; }
        /// <summary>
        /// create date
        /// </summary>
        public DateTime createdAt { get; set; }
    }
}
