using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkReport.Component
{
    public class Story : EntityRequest
    {
        public Story()
        {
        }

        public Story(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.Daily>(),"This Story is referenced and cannot be deleted. Please delete the reference in Daily first！", "StoryId"),
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.PullRequest>(),"This Story is referenced and cannot be deleted. Please delete the reference in Pull Request first！", "StoryId"),
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.WorkingHours>(),"This Week is referenced and cannot be deleted. Please delete the reference in Working hours first！", "StoryId")
            };
            return CommonOperation.DeleteByLogic<Story>(this, relationList);
        }
    }
}
