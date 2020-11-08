using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 条件选项
    /// </summary>
    public interface IConditionItem
    {
        /// <summary>
        /// 以条件类型主键获取实体数据列表
        /// </summary>
        /// <param name="conditionTypeId"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        List<IEntityData> GetEnityDataListByConditionTypeIds(Guid conditionTypeId, byte sex);
    }
}
