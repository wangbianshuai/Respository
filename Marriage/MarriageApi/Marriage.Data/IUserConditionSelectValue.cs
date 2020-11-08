using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 用户条件类型选择值
    /// </summary>
    public interface IUserConditionSelectValue
    {
        /// <summary>
        /// 以用户条件类型主键获取用户条件类型列表
        /// </summary>
        /// <param name="userConditionTypeId"></param>
        /// <returns></returns>
        List<IEntityData> GetEntityDataList(Guid userConditionTypeId);
    }
}
