using Marriage.Entity.Application.MarriageMakePair;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 相亲匹配
    /// </summary>
    public interface IMarriageMakePair
    {
        /// <summary>
        /// 计算相亲匹配
        /// </summary>
        ComputeMarriageMakePairResponse ComputeMarriageMakePair(ComputeMarriageMakePairRequest request);
    }
}
