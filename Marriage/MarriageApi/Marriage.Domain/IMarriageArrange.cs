using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 相亲安排
    /// </summary>
    public interface IMarriageArrange
    {
        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="request"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        List<Entity.Domain.MarriageArrangeUser> QueryMarriageArrangeDataList(Entity.Application.MarriageArrange.QueryMarriageArrangeRequest request, byte sex);

        /// <summary>
        /// 查询分页信息
        /// </summary>
        /// <param name="request"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        Entity.Application.PageInfo QueryMarriageArrangePageInfo(Entity.Application.MarriageArrange.QueryMarriageArrangeRequest request, byte sex);

        /// <summary>
        /// 以主键获取相亲安排
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Entity.Domain.MarriageArrange GetMarriageArrange(Guid id);
    }
}
