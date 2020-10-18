using Marriage.Entity.Service.LeanCloud;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Service
{
    /// <summary>
    /// Lean Cloud
    /// </summary>
    public interface ILeanCloud
    {
        /// <summary>
        /// 创建聊天室
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public CreateChatRoomResponse CreateChatRoom(CreateChatRoomRequest request);
    }
}
