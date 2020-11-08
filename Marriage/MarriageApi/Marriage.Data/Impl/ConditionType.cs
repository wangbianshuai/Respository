using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class ConditionType : EntityAccess, IConditionType
    {
        public ConditionType()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.ConditionType>();
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
            parameterList.Add(this.InParameter("@ConditionTypeId", id));

            query.Where("where IsDelete=0 and ConditionTypeId=@ConditionTypeId", parameterList);

            return this.SelectEntity(query);
        }

    }
}
