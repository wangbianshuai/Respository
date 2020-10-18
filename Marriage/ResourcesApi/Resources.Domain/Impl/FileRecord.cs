using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Resources.Domain.Impl
{
    /// <summary>
    /// 文件记录
    /// </summary>
    public class FileRecord : IFileRecord
    {
        public Data.IFileRecord _FileRecord { get; set; }
        /// <summary>
        /// 插入文件记录
        /// </summary>
        /// <param name="fileRecord"></param>
        /// <returns></returns>
        public bool InsertFileRecord(Entity.Domain.FileRecord fileRecord)
        {
            IEntityData entityData = new EntityData("FileRecord");

            entityData.SetValue("FileId", fileRecord.FileId);
            entityData.SetValue("AppId", fileRecord.AppId);
            entityData.SetValue("IpAddress", fileRecord.IpAddress);
            entityData.SetValue("FileName", fileRecord.FileName);
            entityData.SetValue("FilePath", fileRecord.FilePath);
            entityData.SetValue("FileSize", fileRecord.FileSize);
            entityData.SetValue("FileType", fileRecord.FileType);

            return _FileRecord.Insert(entityData) != Guid.Empty;
        }

        /// <summary>
        /// 获取文件记录
        /// </summary>
        /// <param name="fileId"></param>
        /// <returns></returns>
        public Entity.Domain.FileRecord GetFileRecord(Guid fileId)
        {
            return Parse.IEntityDataTo<Entity.Domain.FileRecord>(_FileRecord.GetEntityDataById(fileId));
        }

        /// <summary>
        /// 删除文件记录
        /// </summary>
        /// <param name="fileId"></param>
        /// <returns></returns>
        public bool DeleteFileRecord(Guid fileId)
        {
            return _FileRecord.DeleteById(fileId);
        }
    }
}
