using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.File
{
    /// <summary>
    /// 获取文件请求
    /// </summary>
    public class GetFileRequest : Request, IRequest
    {
        /// <summary>
        /// 文件ID
        /// </summary>
        public Guid FileId { get; set; }
    }

    /// <summary>
    /// 删除文件响应
    /// </summary>
    public class GetFileResponse : Response, IResponse
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
