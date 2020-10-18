using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.LiveCloud
{
    /// <summary>
    /// 创建录制规则请求
    /// </summary>
    public class CreateRecordRuleRequest : Request, IRequest
    {
        /// <summary>
        /// SecretId
        /// </summary>
        public string SecretId { get; set; }
        /// <summary>
        /// SecretKey
        /// </summary>
        public string SecretKey { get; set; }
        /// <summary>
        /// 服务结节主机
        /// </summary>
        public string Endpoint { get; set; }
        /// <summary>
        /// 请求参数
        /// </summary>
        public CreateLiveRecordRuleRequestParameter RequestParameter { get; set; }
    }

    /// <summary>
    /// 请求参数
    /// </summary>
    public class CreateLiveRecordRuleRequestParameter
    {
        /// <summary>
        /// 推流域名。
        /// </summary>
        public string DomainName { get; set; }
        /// <summary>
        /// 模板 ID。
        /// </summary>
        public long TemplateId { get; set; }
        /// <summary>
        /// 推流路径，与推流和播放地址中的AppName保持一致，默认为 live。
        /// </summary>
        public string AppName { get; set; }
        /// <summary>
        /// 流名称。 注：如果本参数设置为非空字符串，规则将只对此推流起作用。
        /// </summary>
        public string StreamName { get; set; }

    }
    /// <summary>
    /// 创建录制规则响应
    /// </summary>
    public class CreateRecordRuleResponse : Response, IResponse
    {

    }
}
