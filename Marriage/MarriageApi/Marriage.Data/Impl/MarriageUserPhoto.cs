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

        /// <summary>
        /// 删除用户照片
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="photoIds"></param>
        /// <returns></returns>
        public bool DeleteUserPhotos(Guid userId, List<Guid> photoIds)
        {
            if (photoIds == null || photoIds.Count == 0) return false;

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();

            IEntityData entityData = new EntityData("MarriageUserPhoto");
            entityData.SetValue("IsDelete", 1);

            List<string> inParameterList = new List<string>();
            parameterList.Add(this.InParameter("@MarriageUserId", userId));
            photoIds.ForEach(n =>
            {
                var parameterName = "@P" + Guid.NewGuid().ToString().Substring(0, 8).ToString();
                parameterList.Add(this.InParameter(parameterName, n));
                inParameterList.Add(parameterName);
            });

            IQuery query = new Query(this.EntityType.TableName);
            query.Where(string.Format("where MarriageUserId=@MarriageUserId and PhotoId in ({0})", string.Join(",", inParameterList)), parameterList);
            return this.UpdateEntity(query, entityData);
        }
    }
}
