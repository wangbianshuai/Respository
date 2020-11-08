using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class UserConditionSelectValue : EntityAccess, IUserConditionSelectValue
    {
        public UserConditionSelectValue()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.UserConditionSelectValue>();
        }

        /// <summary>
        /// 以用户条件类型主键获取用户条件类型列表
        /// </summary>
        /// <param name="userConditionTypeId"></param>
        /// <returns></returns>
        public List<IEntityData> GetEntityDataList(Guid userConditionTypeId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@UserConditionTypeId", userConditionTypeId));

            query.Where("where UserConditionTypeId=@UserConditionTypeId", parameterList);

            return this.SelectEntities(query);
        }

        /// <summary>
        /// 以用户条件类型Id删除
        /// </summary>
        /// <param name="userConditionTypeId"></param>
        /// <returns></returns>
        public bool DeleteByUserConditionTypeId(Guid userConditionTypeId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@UserConditionTypeId", userConditionTypeId));

            query.Where("where UserConditionTypeId=@UserConditionTypeId", parameterList);

            return this.DeleteEntity(query);
        }

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        public Guid Insert(IEntityData entityData)
        {
            object primaryKey = null;
            if (this.InsertEntity(entityData, out primaryKey)) return (Guid)primaryKey;
            return Guid.Empty;
        }
    }
}
