using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// Lean Cloud
    /// </summary>
    public class LeanCloud : ILeanCloud
    {
        public Service.ILeanCloud _LeanCloud { get; set; }

        /// <summary>
        /// 创建聊天室
        /// </summary>
        /// <param name="leanCloundConfigs"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public Entity.Service.LeanCloud.CreateChatRoomResponse CreateChatRoom(List<Entity.Domain.DictionaryConfig> leanCloundConfigs, string name)
        {
            Entity.Service.LeanCloud.CreateChatRoomResponse response = new Entity.Service.LeanCloud.CreateChatRoomResponse();

            Entity.Service.LeanCloud.CreateChatRoomRequest request = new Entity.Service.LeanCloud.CreateChatRoomRequest();
            request.Name = name;

            leanCloundConfigs.ForEach(d =>
            {
                if (d.Name == "LeanCloud_AppID") request.AppId = d.Value;
                else if (d.Name == "LeanCloud_MasterKey") request.MasterKey = d.Value;
                else if (d.Name == "LeanCloud_RestApi") request.ServiceUrl = d.Value;
            });

            if (string.IsNullOrEmpty(request.ServiceUrl))
            {
                response.result = false;
                response.errMessage = "请先在后台管理系统中的【键值配置】配置LeanCloud_RestApi";
            }
            else if (string.IsNullOrEmpty(request.AppId))
            {
                response.result = false;
                response.errMessage = "请先在后台管理系统中的【键值配置】LeanCloud_AppID";
            }
            else if (string.IsNullOrEmpty(request.MasterKey))
            {
                response.result = false;
                response.errMessage = "请先在后台管理系统中的【键值配置】LeanCloud_MasterKey";
            }
            else response = _LeanCloud.CreateChatRoom(request);

            return response;
        }
    }
}
