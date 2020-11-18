using Marriage.Entity.Application.MarriageSquare;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 相亲广场
    /// </summary>
    public interface IMarriageSquare
    {
        /// <summary>
        /// 查询相亲广场
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        QueryMarriageSquareResponse QueryMarriageSquare(QueryMarriageSquareRequest request);
    }
}
