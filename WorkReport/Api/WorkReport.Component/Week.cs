using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkReport.Component
{
    public class Week : EntityRequest
    {
        public Week()
        {
        }

        public Week(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.WorkingHours>(),"This Week is referenced and cannot be deleted. Please delete the reference in Working hours first！", "WeekId")
            };
            return CommonOperation.DeleteByLogic<Week>(this, relationList);
        }
    }
}
