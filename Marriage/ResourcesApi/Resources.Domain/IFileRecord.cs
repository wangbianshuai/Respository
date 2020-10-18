using System;
using System.Collections.Generic;
using System.Text;

namespace Resources.Domain
{
    /// <summary>
    /// 文件记录
    /// </summary>
    public interface IFileRecord
    {
        /// <summary>
        /// 插入文件记录
        /// </summary>
        /// <param name="fileRecord"></param>
        /// <returns></returns>
        bool InsertFileRecord(Entity.Domain.FileRecord fileRecord);

        /// <summary>
        /// 获取文件记录
        /// </summary>
        /// <param name="fileId"></param>
        /// <returns></returns>
        Entity.Domain.FileRecord GetFileRecord(Guid fileId);

        /// <summary>
        /// 删除文件记录
        /// </summary>
        /// <param name="fileId"></param>
        /// <returns></returns>
        bool DeleteFileRecord(Guid fileId);
    }
}
