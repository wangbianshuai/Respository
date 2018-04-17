using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class Customer : EntityRequest
    {
        public Customer()
        {
        }

        public Customer(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.Order>(),"此客户存在被引用，不能删除，请先取消支订单引用！", "CustomerId")      
            };
            return CommonOperation.DeleteByLogic<Customer>(this, relationList);
        }
    }
}
