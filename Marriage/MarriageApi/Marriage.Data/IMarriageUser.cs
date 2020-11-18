using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 相亲人员
    /// </summary>
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

        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="queryInfo"></param>
        /// <returns></returns>
        List<IEntityData> QueryDataList(Entity.Data.QueryInfo queryInfo);

        /// <summary>
        /// 查询总记录数
        /// </summary>
        /// <param name="queryInfo"></param>
        /// <returns></returns>
        int QueryCount(Entity.Data.QueryInfo queryInfo);
    }
}
