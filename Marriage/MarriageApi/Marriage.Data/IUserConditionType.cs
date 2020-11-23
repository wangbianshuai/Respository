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

        /// <summary>
        /// 以主键获取实体数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        IEntityData GetEntityDataById(Guid id);

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        Guid Insert(IEntityData entityData);

        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        bool Update(IEntityData entityData);

        /// <summary>
        /// 获取条件型
        /// </summary>
        /// <returns></returns>
        List<IEntityData> GetUserConditionTypes();

        /// <summary>
        /// 以条件类型和用户Id获取用户条件信息
        /// </summary>
        /// <param name="conditionTypeId"></param>
        /// <param name="userId"></param>
        /// <param name="selectType"></param>
        /// <returns></returns>
        IEntityData GetUserConditionTypeByConditionTypeIdAndUser(Guid conditionTypeId, Guid userId, byte selectType);
    }
}
