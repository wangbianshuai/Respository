using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace Marriage.Data.Impl
{
    public class Live : BaseData, ILive
    {
        public Live()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.Live>();
        }

        /// <summary>
        /// 以名称获取实体数据
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public IEntityData GetEntityDataByName(string name)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@Name", name));

            query.Where("where IsDelete=0 and Name=@Name", parameterList);

            return this.SelectEntity(query);
        }

        /// <summary>
        /// 以编号获取实体数据
        /// </summary>
        /// <param name="liveCode"></param>
        /// <returns></returns>
        public IEntityData GetEntityDataByLiveCode(string liveCode)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@LiveCode", liveCode));

            query.Where("where LiveCode=@LiveCode", parameterList);

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
            return this.SelectEntityByPrimaryKey(id);
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
        /// 以编辑视频任务ID获取直播
        /// </summary>
        /// <param name="editMediaTaskId"></param>
        /// <returns></returns>
        public IEntityData GetLiveByEditMediaTaskId(string editMediaTaskId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@EditMediaTaskId", editMediaTaskId));

            query.Where("where EditMediaTaskId=@EditMediaTaskId", parameterList);

            return this.SelectEntity(query);
        }

        /// <summary>
        /// 以主键删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool DeleteById(Guid id)
        {
            return this.DeleteEntityByPrimaryKey(id);
        }
    }
}
