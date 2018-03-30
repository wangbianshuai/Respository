using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class Bill : EntityRequest
    {
        public Bill()
        {
        }

        public Bill(Request request)
            : base(request)
        {
        }

        [Log]
        public object Insert2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("BillDate", DateTime.Now);
            entityData.SetDefaultValue("BillUser", this._Request.OperationUser);
            entityData.SetDefaultValue("CreateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);

            return this.Insert();
        }

        [Log]
        public object Update2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("BillDate", DateTime.Now);
            entityData.SetDefaultValue("BillUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);

            return this.Update();
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<Bill>(this);
        }
    }
}
