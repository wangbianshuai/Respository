using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    /// <summary>
    /// 相亲人员照片
    /// </summary>
    public class MarriageUserPhoto : EntityAccess, IMarriageUserPhoto
    {
        public MarriageUserPhoto()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.MarriageUserPhoto>();
        }

        /// <summary>
        /// 以用户Id获取实体数据列表
        /// </summary>
        /// <param name="marriageUserId"></param>
        /// <returns></returns>
        public List<IEntityData> GetEnityDataListByUserId(Guid marriageUserId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@MarriageUserId", marriageUserId));

            query.Where("where IsDelete=0 and MarriageUserId=@MarriageUserId", parameterList);
            query.OrderBy("order by CreateDate desc");

            return this.SelectEntities(query);
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
