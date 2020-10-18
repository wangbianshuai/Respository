using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 直播
    /// </summary>
    public interface ILive
    {
        /// <summary>
        /// 以名称获取实体数据
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        IEntityData GetEntityDataByName(string name);

        /// <summary>
        /// 以编号获取实体数据
        /// </summary>
        /// <param name="liveCode"></param>
        /// <returns></returns>
        IEntityData GetEntityDataByLiveCode(string liveCode);

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
        /// 以编辑视频任务ID获取直播
        /// </summary>
        /// <param name="editMediaTaskId"></param>
        /// <returns></returns>
        IEntityData GetLiveByEditMediaTaskId(string editMediaTaskId);

        /// <summary>
        /// 以主键删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        bool DeleteById(Guid id);

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
