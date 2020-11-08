using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 条件类型
    /// </summary>
    public class ConditionType : IConditionType
    {
        public Data.IConditionType _ConditionType { get; set; }

        /// <summary>
        /// 以条件类型Id获取条件类型
        /// </summary>
        /// <param name="conditionTypeId"></param>
        /// <returns></returns>
        public Entity.Domain.ConditionType GetConditionTypeById(Guid conditionTypeId)
        {
            return Parse.IEntityDataTo<Entity.Domain.ConditionType>(_ConditionType.GetEntityDataById(conditionTypeId));
        }
    }
}
