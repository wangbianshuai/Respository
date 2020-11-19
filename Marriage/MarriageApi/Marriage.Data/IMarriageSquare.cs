using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 相亲广场
    /// </summary>
    public interface IMarriageSquare
    {
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

        /// <summary>
        /// 获取相亲广场用户
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        IEntityData GetMarriageSquareUserByUserId(Guid loginUserId, Guid userId, int type);

        /// <summary>
        /// 更新相亲广场玫瑰数
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <param name="isSend"></param>
        /// <returns></returns>
        bool UpdateMarriageSquareRoseCount(Guid loginUserId, Guid userId);

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        Guid Insert(IEntityData entityData);

        /// <summary>
        /// 删除相亲广场
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        bool DeleteMarriageSquareByUserId(Guid loginUserId, Guid userId);
    }
}
