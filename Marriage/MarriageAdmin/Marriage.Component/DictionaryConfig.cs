using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Component
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
