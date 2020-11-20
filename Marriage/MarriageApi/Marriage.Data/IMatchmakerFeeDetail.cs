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
    }
}
