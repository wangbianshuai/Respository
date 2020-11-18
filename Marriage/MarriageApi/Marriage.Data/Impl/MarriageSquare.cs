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
    public class MarriageSquare : BaseData, IMarriageSquare
    {
        public MarriageSquare()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.MarriageSquare>();
        }
    }
}
