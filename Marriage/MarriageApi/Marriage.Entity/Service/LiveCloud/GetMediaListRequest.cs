using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.LiveCloud
{
    /// <summary>
    /// 获取流名称下视频文件请求
    /// </summary>
    public class GetMediaListRequest : Request, IRequest
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
        public GetMediaListRequestParameter RequestParameter { get; set; }
    }

    /// <summary>
    /// 请求参数
    /// </summary>
    public class GetMediaListRequestParameter
    {
        /// <summary>
        /// 流名称集合
        /// </summary>
        public List<string> StreamIds { get; set; }
 
    }

    /// <summary>
    ///  获取流名称下视频文件响应
    /// </summary>
    public class GetMediaListRespponse : Response, IResponse
    {
        /// <summary>
        /// 文件Id集合
        /// </summary>
        public List<string> FileIdList { get; set; }
    }
}
