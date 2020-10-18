using Marriage.Entity.Application.Message;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 消息
    /// </summary>
    public interface IMessage
    {
        /// <summary>
        /// 同步微信消息模板
        /// </summary>
        SyncWeChatTemplateResponse SyncWeChatTemplate(SyncWeChatTemplateRequest request, string token);
    }
}
