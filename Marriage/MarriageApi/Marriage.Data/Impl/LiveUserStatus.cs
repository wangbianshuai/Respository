using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class LiveUserStatus : EntityAccess, ILiveUserStatus
    {
        public LiveUserStatus()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.LiveUserStatus>();
        }

        /// <summary>
        /// 以直播ID和用户ID获取实体数据
        /// </summary>
        /// <param name="liveId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public IEntityData GetEntityDataByLiveIdAndUserId(Guid liveId, string userId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@LiveId", liveId));
            parameterList.Add(this.InParameter("@UserId", userId));

            query.Where("where LiveId=@LiveId and UserId=@UserId", parameterList);

            return this.SelectEntity(query);
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
