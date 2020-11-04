using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 消息管理
    /// </summary>
    public class MessageManage : IMessageManage
    {
        public Service.IMessageManage _MessageManage { get; set; }

        /// <summary>
        /// 获取模板列表
        /// </summary>
        /// <param name="accessToken"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        public Entity.Service.MessageManage.GetTemplateListResponse GetTemplateList(string accessToken, string url)
        {
            return _MessageManage.GetTemplateList(new Entity.Service.MessageManage.GetTemplateListRequest()
            {
                AccessToken = accessToken,
                Url = url
            });
        }
    }
}
