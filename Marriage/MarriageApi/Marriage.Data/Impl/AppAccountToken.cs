using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class AppAccountToken: EntityAccess, IAppAccountToken
    {
        public AppAccountToken()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.AppAccountToken>();
        }

        /// <summary>
        /// 获取App账号访问Token
        /// </summary>
        /// <param name="appAccountId"></param>
        /// <returns></returns>
        public IEntityData GetEntityData(Guid appAccountId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@AppAccountId", appAccountId));

            query.Where("where AppAccountId=@AppAccountId", parameterList);

            return this.SelectEntity(query);
        }

        /// <summary>
        /// 新增App账号访问Token
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        public bool Insert(IEntityData entityData)
        {
            return this.InsertEntity(entityData, out _);
        }

        /// <summary>
        /// 更新App账号访问Token
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
