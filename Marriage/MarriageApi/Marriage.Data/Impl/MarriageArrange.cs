using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    /// <summary>
    /// 相亲安排
    /// </summary>
    public class MarriageArrange : BaseData, IMarriageArrange
    {
        public MarriageArrange()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.MarriageArrange>();
        }

        /// <summary>
        /// 获取相亲安排用户
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        public IEntityData GetMarriageArrangeUserByUserId(Guid loginUserId, Guid userId, byte sex)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@LoginUserId", loginUserId));
            parameterList.Add(this.InParameter("@UserId", userId));

            if (sex == 1) query.Where("where ManUserId=@LoginUserId and WomanUserId=@UserId", parameterList);
            else if (sex == 2) query.Where("where ManUserId=@UserId and WomanUserId=@LoginUserId", parameterList);

            return this.SelectEntity(query);
        }

        /// <summary>
        /// 以主键获取实体数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IEntityData GetEntityDataById(Guid id)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@MarriageArrangeId", id));

            query.Where("where IsDelete=0 and MarriageArrangeId=@MarriageArrangeId", parameterList);

            return this.SelectEntity(query);
        }

        /// <summary>
        /// 以主键获取视图实体数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IEntityData GetViewEntityDataById(Guid id)
        {
            IQuery query = new Query("v_MarriageArrange2");

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@MarriageArrangeId", id));

            query.Where("where MarriageArrangeId=@MarriageArrangeId", parameterList);

            return this.SelectEntity(query);
        }

        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        public bool Update(IEntityData entityData)
        {
            object primaryKey = entityData.GetValue(this.EntityType.PrimaryKey);
            return this.UpdateEntityByPrimaryKey(primaryKey, entityData);
        }
    }
}
