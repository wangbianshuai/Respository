using Marriage.Entity.Service.MessageManage;
using Marriage.Entity.Service.UserManage;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Marriage.Service.Impl
{
    /// <summary>
    /// 用户管理
    /// </summary>
    public class MessageManage : BaseService, IMessageManage
    {
        /// <summary>
        /// 获取模板列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetTemplateListResponse GetTemplateList(GetTemplateListRequest request)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            dict.Add("access_token", request.AccessToken);

            string url = string.Format("{0}?{1}", request.Url, new FormUrlEncodedContent(dict).ReadAsStringAsync().Result);
            return this.GetRequest2<GetTemplateListResponse>(url);
        }
    }
}
