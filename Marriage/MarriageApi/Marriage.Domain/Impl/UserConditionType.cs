using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 用户条件类型
    /// </summary>
    public class UserConditionType : IUserConditionType
    {
        public Data.IUserConditionType _UserConditionType { get; set; }

        /// <summary>
        /// 以用户Id和选择类型获取用户条件类型列表
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="selectType"></param>
        /// <returns></returns>
        public List<Entity.Domain.ViewUserConditionType> GetUserConditionTypeList(Guid userId, byte selectType)
        {
            var userTypeList = Parse.IEntityDataListTo<Entity.Domain.ViewUserConditionType>(_UserConditionType.GetViewUserConditionTypeList(userId, selectType));

            var typeList = Parse.IEntityDataListTo<Entity.Domain.ConditionType>(_UserConditionType.GetViewConditionTypeList());

            var noUserTypeList = typeList.Except((from a in userTypeList
                                                  from b in typeList
                                                  where a.ConditionTypeId == b.ConditionTypeId
                                                  select b));
            foreach (var c in noUserTypeList)
            {
                userTypeList.Add(new Entity.Domain.ViewUserConditionType()
                {
                    ConditionTypeId = c.ConditionTypeId,
                    ConditionTypeName = c.Name,
                    ItemCount = c.ItemCount,
                    SelectType = selectType,
                    UserId = userId
                });
            }

            return userTypeList;
        }
    }
}
