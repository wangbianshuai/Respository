using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data.Impl
{
    /// <summary>
    /// 费用价格
    /// </summary>
    public class LiveFeePrice : EntityAccess, ILiveFeePrice
    {
        public LiveFeePrice()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.LiveFeePrice>();
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
