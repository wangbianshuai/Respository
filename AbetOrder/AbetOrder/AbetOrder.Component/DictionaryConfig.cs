using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class DictionaryConfig : EntityRequest
    {
        public DictionaryConfig()
        {
        }

        public DictionaryConfig(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<DictionaryConfig>(this);
        }
    }
}
