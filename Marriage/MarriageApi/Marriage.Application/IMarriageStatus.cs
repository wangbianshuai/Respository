using Marriage.Entity.Application.MarriageStatus;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 相亲状态
    /// </summary>
    public interface IMarriageStatus
    {
        /// <summary>
        /// 获取相亲状态
        /// </summary>
        GetMarriageStatusResponse GetMarriageStatus(GetMarriageStatusRequest request);

        /// <summary>
        /// 保存相亲状态
        /// </summary>
        SaveMarriageStatusResponse SaveMarriageStatus(SaveMarriageStatusRequest request);
    }
}
