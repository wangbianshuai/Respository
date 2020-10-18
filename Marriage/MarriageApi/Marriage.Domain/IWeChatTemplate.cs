using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 微信消息模板
    /// </summary>
    public interface IWeChatTemplate
    {
        /// <summary>
        /// 判断十分钟之内是否已更新
        /// </summary>
        /// <returns></returns>
        string JudgeIsUpdate();

        /// <summary>
        /// 更新微信消息模板数据
        /// </summary>
        /// <param name="templateInfoList"></param>
        /// <param name="appAccountId"></param>
        /// <param name="adminUserId"></param>
        /// <returns></returns>
        void UpdateWeChatTemplateData(List<Entity.Service.MessageManage.TemplateInfo> templateInfoList, Guid appAccountId, Guid adminUserId);
    }
}
