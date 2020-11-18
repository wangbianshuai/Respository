using Marriage.Entity.Application.MarriageArrange;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 相亲安排
    /// </summary>
    public interface IMarriageArrange
    {
        /// <summary>
        /// 查询相亲安排
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        QueryMarriageArrangeResponse QueryMarriageArrange(QueryMarriageArrangeRequest request);
    }
}
