using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Component
{
    public class Dictionary2 : EntityRequest
    {
        public Dictionary2()
        {
        }

        public Dictionary2(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<Dictionary2>(this, null);
        }
    }
}
