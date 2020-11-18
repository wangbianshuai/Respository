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
    }
}
