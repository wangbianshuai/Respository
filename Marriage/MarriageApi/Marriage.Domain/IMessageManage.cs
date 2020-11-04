using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 消息管理
    /// </summary>
    public interface IMessageManage
    {
        /// <summary>
        /// 获取模板列表
        /// </summary>
        /// <param name="accessToken"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        Entity.Service.MessageManage.GetTemplateListResponse GetTemplateList(string accessToken, string url);
    }
}
