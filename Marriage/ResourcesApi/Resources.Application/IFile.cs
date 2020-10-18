using Resources.Entity.Application.File;
using System;
using System.Collections.Generic;
using System.Text;

namespace Resources.Application
{
    /// <summary>
    /// 文件
    /// </summary>
    public interface IFile
    {
        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        UploadFileResponse UploadFile(UploadFileRequest request);

        /// <summary>
        /// 获取文件
        /// </summary>
        /// <param name="request"></param>
        /// <param name="httpHost"></param>
        /// <returns></returns>
        GetFileResponse GetFile(GetFileRequest request, string httpHost);

        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="request"></param>
        /// <param name="webRootPath"></param>
        /// <returns></returns>
        DeleteFileResponse DeleteFile(DeleteFileRequest request, string webRootPath);
    }
}
