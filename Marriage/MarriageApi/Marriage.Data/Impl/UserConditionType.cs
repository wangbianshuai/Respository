using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class UserConditionType : EntityAccess, IUserConditionType
    {
        public UserConditionType()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.UserConditionType>();
        }

        /// <summary>
        /// 以用户Id和选择类型获取用户条件类型列表
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="selectType"></param>
        /// <returns></returns>
        public List<IEntityData> GetViewUserConditionTypeList(Guid userId, byte selectType)
        {
            IQuery query = new Query("v_UserConditionType");

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@UserId", userId));
            parameterList.Add(this.InParameter("@SelectType", selectType));

            query.Where("where UserId=@UserId and SelectType=@SelectType", parameterList);

            return this.SelectEntities(query);
        }

        /// <summary>
        /// 以用户Id和选择类型获取条件类型列表
        /// </summary>
        /// <returns></returns>
        public List<IEntityData> GetViewConditionTypeList()
        {
            IQuery query = new Query("v_ConditionType");
            return this.SelectEntities(query);
        }
    }
}
