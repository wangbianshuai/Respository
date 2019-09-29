using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Component
{
    public class Supplier : EntityRequest
    {
        public Supplier()
        {
        }

        public Supplier(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<Supplier>(this, null);
        }
    }
}
