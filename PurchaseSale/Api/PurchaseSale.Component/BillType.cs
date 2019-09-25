using OpenDataAccess.Data;
using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Component
{
    public class BillType : EntityRequest
    {
        public BillType()
        {
            this.EntityType = EntityType.GetEntityType<Entity.BillType>();
        }

        public BillType(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.Bill>(),"此账目类型存在被引用，不能删除，请先取消支付明细中引用！", "BillTypeId")
            };
            return CommonOperation.DeleteByLogic<BillType>(this, relationList);
        }
    }
}
