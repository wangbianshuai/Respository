using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class TemplateHtml : EntityRequest
    {
        public TemplateHtml()
        {
        }

        public TemplateHtml(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.Order>(),"此订单模板存在被引用，不能删除，请先取消订单中引用！", "OrderTemplateHtmlId"),
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.Order>(),"此订单模板存在被引用，不能删除，请先取消订单中引用！", "OrderTemplateHtmlId")
            };
            return CommonOperation.DeleteByLogic<TemplateHtml>(this, relationList);
        }
    }
}
