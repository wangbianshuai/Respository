using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 相亲广场
    /// </summary>
    public interface IMarriageSquare
    {
        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="request"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        List<Entity.Domain.MarriageSquareUser> QueryMarriageSquareDataList(Entity.Application.MarriageSquare.QueryMarriageSquareRequest request, byte sex);

        /// <summary>
        /// 查询分页信息
        /// </summary>
        /// <param name="request"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        Entity.Application.PageInfo QueryMarriageSquarePageInfo(Entity.Application.MarriageSquare.QueryMarriageSquareRequest request, byte sex);

        /// <summary>
        /// 更新相亲广场玫瑰数
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <param name="isSend"></param>
        /// <returns></returns>
        bool UpdateMarriageSquareRoseCount(Guid loginUserId, Guid userId, bool isSend);

        /// <summary>
        /// 新增相亲广场
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        bool InsertMarriageSquare(Guid loginUserId, Guid userId);

        /// <summary>
        /// 获取相亲广场
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        Entity.Domain.MarriageSquare GetMarriageSquareByUserId(Guid loginUserId, Guid userId);
    }
}
