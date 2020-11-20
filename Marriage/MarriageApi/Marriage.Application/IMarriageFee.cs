using Marriage.Entity.Application.MarriageFee;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 相亲费用
    /// </summary>
    public interface IMarriageFee
    {
        /// <summary>
        /// 获取相亲费用
        /// </summary>
        GetMarriageFeeResponse GetMarriageFee(GetMarriageFeeRequest request);

        /// <summary>
        /// 保存相亲费用
        /// </summary>
        SaveMarriageFeeResponse SaveMarriageFee(SaveMarriageFeeRequest request);
    }
}
