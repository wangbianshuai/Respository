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
    public class Factory : EntityRequest
    {
        public Factory()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Factory>();
        }

        public Factory(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<Factory>(this);
        }
    }
}
