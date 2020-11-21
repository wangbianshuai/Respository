using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 相亲费用
    /// </summary>
    public interface IMarriageFee
    {
        /// <summary>
        /// 获取相亲费用
        /// </summary>
        /// <param name="marriageArrangeId"></param>
        /// <param name="manMatchmakerId"></param>
        /// <param name="womanMatchmakerId"></param>
        /// <param name="appMatchmakerId"></param>
        /// <returns></returns>
        Entity.Domain.MarriageFee GetMarriageFee(Guid marriageArrangeId, Guid manMatchmakerId, Guid womanMatchmakerId, Guid appMatchmakerId);

        /// <summary>
        /// 保存相亲费用
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        bool SaveMarriageFee(Entity.Domain.MarriageFee entity);
        
        /// <summary>
        /// 获取红娘总金额
        /// </summary>
        /// <param name="matchmakerId"></param>
        /// <returns></returns>
        Entity.Domain.MarriageFee GetTotalMarriageFee(Guid matchmakerId);

        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        List<Entity.Domain.MatchmakerFeeDetail> QueryMatchmakerFeeDataList(Entity.Application.MarriageFee.QueryMatchmakerFeeRequest request);

        /// <summary>
        /// 查询分页信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Entity.Application.PageInfo QueryMatchmakerFeePageInfo(Entity.Application.MarriageFee.QueryMatchmakerFeeRequest request);
    }
}
