using Marriage.Entity.Service.LeanCloud;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Service.Impl
{
    /// <summary>
    /// LeanCloud
    /// </summary>
    public class LeanCloud : BaseService, ILeanCloud
    {
        /// <summary>
        /// 创建聊天室
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public CreateChatRoomResponse CreateChatRoom(CreateChatRoomRequest request)
        {
            string url = string.Format("{0}/1.2/rtm/chatrooms", request.ServiceUrl);
            Dictionary<string, string> headers = new Dictionary<string, string>();
            headers.Add("X-LC-Id", request.AppId);
            headers.Add("X-LC-Key", request.MasterKey);

            Dictionary<string, object> data = new Dictionary<string, object>();
            data.Add("name", request.Name);

            return this.PostRequest<CreateChatRoomResponse>(url, data, headers);
        }
    }
}
