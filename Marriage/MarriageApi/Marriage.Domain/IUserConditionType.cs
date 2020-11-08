using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 用户条件类型
    /// </summary>
    public interface IUserConditionType
    {
        /// <summary>
        /// 以用户Id和选择类型获取用户条件类型列表
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="selectType"></param>
        /// <returns></returns>
        List<Entity.Domain.ViewUserConditionType> GetUserConditionTypeList(Guid userId, byte selectType);

        /// <summary>
        /// 以用户条件类型Id获取用户条件类型
        /// </summary>
        /// <param name="conditionTypeId"></param>
        /// <param name="userConditionTypeId"></param>
        /// <param name="sex"></param>
        /// <param name="selectType"></param>
        /// <returns></returns>
        Entity.Domain.UserConditionType GetUserConditionTypeById(Guid conditionTypeId, Guid userConditionTypeId, byte sex, byte selectType);
    }
}
