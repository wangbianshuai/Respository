using Marriage.Entity.Service.MessageManage;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Service
{
    public interface IMessageManage
    {
        /// <summary>
        /// 获取模板列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        GetTemplateListResponse GetTemplateList(GetTemplateListRequest request);
    }
}
