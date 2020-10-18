using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.LiveCloud
{
    /// <summary>
    /// 删除视频文件请求
    /// </summary>
    public class DeleteMediaRequest : Request, IRequest
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
        public DeleteMediaRequestParameter RequestParameter { get; set; }
    }

    /// <summary>
    /// 请求参数
    /// </summary>
    public class DeleteMediaRequestParameter
    {
        /// <summary>
        /// 文件Id
        /// </summary>
        public string FileId { get; set; }

    }

    /// <summary>
    ///  删除视频文件响应
    /// </summary>
    public class DeleteMediaResponse : Response, IResponse
    {
    }
}
