using OpenDataAccess.Data;
using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class BillType : EntityRequest
    {
        public BillType()
        {
            this.EntityType = EntityType.GetEntityType<Entity.BillType>();
        }

        public BillType(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<BillType>(this);
        }
    }
}
