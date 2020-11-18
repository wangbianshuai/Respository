using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    /// <summary>
    /// 相亲广场
    /// </summary>
    public class MarriageSquare : BaseData, IMarriageSquare
    {
        public MarriageSquare()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.MarriageSquare>();
        }

        /// <summary>
        /// 获取相亲广场用户
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public IEntityData GetMarriageSquareUserByUserId(Guid loginUserId, Guid userId, int type)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@LoginUserId", loginUserId));
            parameterList.Add(this.InParameter("@UserId", userId));

            if (type == 1) query.Where("where OtherSideUserId=@UserId and UserId=@LoginUserId", parameterList);
            else if (type == 2) query.Where("where OtherSideUserId=@LoginUserId and UserId=@UserId", parameterList);

            return this.SelectEntity(query);
        }
    }
}
