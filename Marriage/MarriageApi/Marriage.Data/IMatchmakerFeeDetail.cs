using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 红娘中介费明细
    /// </summary>
    public interface IMatchmakerFeeDetail
    {
        /// <summary>
        /// 以相亲安排Id获取费用明细
        /// </summary>
        /// <param name="marriageArrangeId"></param>
        /// <returns></returns>
        List<IEntityData> GetEntityDataList(Guid marriageArrangeId);

        /// <summary>
        /// 以相亲安排Id删除
        /// </summary>
        /// <param name="userConditionTypeId"></param>
        /// <returns></returns>
        bool DeleteByMarriageArrangId(Guid marriageArrangeId);

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        Guid Insert(IEntityData entityData);
        /// <summary>
        /// 获取红娘总金额
        /// </summary>
        /// <param name="matchmakerId"></param>
        /// <returns></returns>
        IEntityData GetTotalAmountByMatchmakerId(Guid matchmakerId);

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
