using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    /// <summary>
    /// 相亲人员
    /// </summary>
    public class MarriageUser : BaseData, IMarriageUser
    {
        public MarriageUser()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.MarriageUser>();
        }

        /// <summary>
        /// 以openId获取实体数据
        /// </summary>
        /// <param name="openId"></param>
        /// <returns></returns>
        public IEntityData GetEntityDataByOpenId(string openId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@OpenId", openId));

            query.Where("where IsDelete=0 and OpenId=@OpenId", parameterList);

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
        /// 以主键获取实体数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IEntityData GetEntityDataById(Guid id)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@UserId", id));

            query.Where("where IsDelete=0 and UserId=@UserId", parameterList);

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

        /// <summary>
        /// 获取相亲匹配用户列表
        /// </summary>
        /// <returns></returns>
        public List<IEntityData> GetMarriageMakePairUsers()
        {
            IQuery query = new Query("v_MarriageUser3");

            return this.SelectEntities(query);
        }
    }
}
