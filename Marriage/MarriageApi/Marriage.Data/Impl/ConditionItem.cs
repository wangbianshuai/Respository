using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class ConditionItem : EntityAccess, IConditionItem
    {
        public ConditionItem()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.ConditionItem>();
        }

        /// <summary>
        /// 以条件类型主键获取实体数据列表
        /// </summary>
        /// <param name="conditionTypeId"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        public List<IEntityData> GetEnityDataListByConditionTypeId(Guid conditionTypeId, byte sex)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@ConditionTypeId", conditionTypeId));

            query.Where(string.Format("where ConditionTypeId=@ConditionTypeId and Sex in (0,{0})", sex), parameterList);

            return this.SelectEntities(query);
        }
    }
}
