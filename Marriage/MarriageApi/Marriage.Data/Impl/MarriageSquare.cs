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

        /// <summary>
        /// 更新相亲广场玫瑰数
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <param name="isSend"></param>
        /// <returns></returns>
        public bool UpdateMarriageSquareRoseCount(Guid loginUserId, Guid userId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@LoginUserId", loginUserId));
            parameterList.Add(this.InParameter("@UserId", userId));

            query.SetSql("update t_MarriageSquare set RoseCount+=1 where OtherSideUserId=@UserId and UserId=@LoginUserId", parameterList);

            return this.CurrentDataBase.ExecSqlNonQuery(query.ToSql(), query.ParameterList);
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

        /// <summary>
        /// 删除相亲广场
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public bool DeleteMarriageSquareByUserId(Guid loginUserId, Guid userId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@LoginUserId", loginUserId));
            parameterList.Add(this.InParameter("@UserId", userId));

            query.Where("where OtherSideUserId=@UserId and UserId=@LoginUserId", parameterList);

            return this.DeleteEntity(query);
        }
    }
}
