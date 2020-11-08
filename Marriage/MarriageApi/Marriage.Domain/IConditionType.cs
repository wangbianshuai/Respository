using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 条件类型
    /// </summary>
    public interface IConditionType
    {
        /// <summary>
        /// 以条件类型Id获取条件类型
        /// </summary>
        /// <param name="conditionTypeId"></param>
        /// <returns></returns>
        Entity.Domain.ConditionType GetConditionTypeById(Guid conditionTypeId);
    }
}
