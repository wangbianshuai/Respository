using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    /// <summary>
    /// 相亲安排
    /// </summary>
    public class MarriageArrange : BaseData, IMarriageArrange
    {
        public MarriageArrange()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.MarriageArrange>();
        }
    }
}
