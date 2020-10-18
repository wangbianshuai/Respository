using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Component
{
    public class ServiceInterface : EntityRequest
    {
        public ServiceInterface()
        {
        }

        public ServiceInterface(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<ServiceInterface>(this);
        }
    }
}
