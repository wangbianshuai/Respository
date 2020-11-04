using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.MessageManage
{
    /// <summary>
    /// 获取模板列表请求
    /// </summary>
    public class GetTemplateListRequest : Request, IRequest
    {
    }

    /// <summary>
    /// 获取模板列表响应
    /// </summary>
    public class GetTemplateListResponse : Response, IResponse
    {
        /// <summary>
        /// 模板列表
        /// </summary>
        public List<TemplateInfo> Template_List { get; set; }
    }

    /// <summary>
    /// 模板信息
    /// </summary>
    public class TemplateInfo
    {
        /// <summary>
        /// 模板ID
        /// </summary>
        public string Template_Id { get; set; }
        /// <summary>
        /// 模板标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 模板所属行业的一级行业
        /// </summary>
        public string Primary_Industry { get; set; }
        /// <summary>
        /// 模板所属行业的二级行业
        /// </summary>
        public string Deputy_Industry { get; set; }
        /// <summary>
        /// 模板内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 模板示例
        /// </summary>
        public string Example { get; set; }
    }
}
