using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
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
        List<IEntityData> GetViewUserConditionTypeList(Guid userId, byte selectType);

        /// <summary>
        /// 以用户Id和选择类型获取条件类型列表
        /// </summary>
        /// <returns></returns>
        List<IEntityData> GetViewConditionTypeList();
    }
}
