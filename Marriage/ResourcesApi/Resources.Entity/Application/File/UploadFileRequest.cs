using System;
using System.Collections.Generic;
using System.Text;

namespace Resources.Entity.Application.File
{
    /// <summary>
    /// 上传文件请求
    /// </summary>
    public class UploadFileRequest : Request, IRequest
    {
        /// <summary>
        /// 文件流
        /// </summary>
        public byte[] Stream { get; set; }
        /// <summary> 
        /// 文件名
        /// </summary> 
        public string FileName { get; set; }
        /// <summary> 
        /// 文件类型
        /// </summary> 
        public string FileType { get; set; }
        /// <summary>
        /// 文件后缀名
        /// </summary>
        public string FileExt { get; set; }
        /// <summary> 
        /// 文件大小(B)
        /// </summary> 
        public long FileSize { get; set; }

        /// <summary>
        /// 根路径
        /// </summary>
        public string WebRootPath { get; set; }

        /// <summary>
        /// Http Host
        /// </summary>
        public string HttpHost { get; set; }
    }

    /// <summary>
    /// 上传文件响应
    /// </summary>
    public class UploadFileResponse : Response, IResponse
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid FileId { get; set; }
        /// <summary> 
        /// 文件URL
        /// </summary> 
        public string FileUrl { get; set; }
        /// <summary> 
        /// 文件名
        /// </summary> 
        public string FileName { get; set; }
        /// <summary> 
        /// 文件类型
        /// </summary> 
        public string FileType { get; set; }
        /// <summary> 
        /// 文件大小(MB/KB)
        /// </summary> 
        public string FileSize { get; set; }
    }
}
