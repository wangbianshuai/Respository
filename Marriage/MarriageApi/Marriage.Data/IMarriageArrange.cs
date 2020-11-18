using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 相亲安排
    /// </summary>
    public interface IMarriageArrange
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
        /// 获取相亲安排用户
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        IEntityData GetMarriageArrangeUserByUserId(Guid loginUserId, Guid userId, byte sex);
    }
}
