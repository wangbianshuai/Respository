using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkReport.Component
{
    public class WorkingHours : EntityRequest
    {
        public WorkingHours()
        {
        }

        public WorkingHours(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<WorkingHours>(this, null);
        }
    }
}
