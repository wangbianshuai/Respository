using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data.Impl
{
    /// <summary>
    /// 文件记录
    /// </summary>
    public class FileRecord : EntityAccess, IFileRecord
    {
        public FileRecord()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.FileRecord>();
        }

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        public Guid Insert(IEntityData entityData)
        {
            object primaryKey = null;
            if (this.InsertEntity(entityData, out primaryKey)) return (Guid)primaryKey;
            return Guid.Empty;
        }

        /// <summary>
        /// 以主键获取实体数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IEntityData GetEntityDataById(Guid id)
        {
            return this.SelectEntityByPrimaryKey(id);
        }

        /// <summary>
        /// 以主键删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool DeleteById(Guid id)
        {
            return this.DeleteEntityByPrimaryKey(id);
        }
    }
}
