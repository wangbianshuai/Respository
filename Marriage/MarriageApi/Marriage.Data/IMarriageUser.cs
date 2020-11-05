using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    public interface IMarriageUser
    {
        /// <summary>
        /// 以openId获取实体数据
        /// </summary>
        /// <param name="openId"></param>
        /// <returns></returns>
        IEntityData GetEntityDataByOpenId(string openId);

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        Guid Insert(IEntityData entityData);

        /// <summary>
        /// 以主键获取实体数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        IEntityData GetEntityDataById(Guid id);

        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        bool Update(IEntityData entityData);

    }
}
