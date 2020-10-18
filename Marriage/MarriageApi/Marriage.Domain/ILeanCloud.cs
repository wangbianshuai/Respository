using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// Lean Cloud
    /// </summary>
    public interface ILeanCloud
    {
        /// <summary>
        /// 创建聊天室
        /// </summary>
        /// <param name="leanCloundConfigs"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        Entity.Service.LeanCloud.CreateChatRoomResponse CreateChatRoom(List<Entity.Domain.DictionaryConfig> leanCloundConfigs, string name);
    }
}
