using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.File
{
    /// <summary>
    /// 删除文件请求
    /// </summary>
    public class DeleteFileRequest : Request, IRequest
    {
        /// <summary>
        /// 文件ID
        /// </summary>
        public Guid FileId { get; set; }
    }

    /// <summary>
    /// 删除文件响应
    /// </summary>
    public class DeleteFileResponse : Response, IResponse
    {

    }
}
