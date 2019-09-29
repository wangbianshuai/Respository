using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Component
{
    public class PersonBillType : EntityRequest
    {
        public PersonBillType()
        {
        }

        public PersonBillType(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.PersonBill>(),"此账目类型存在被引用，不能删除，请先删除个人收支中引用！", "PersonBillTypeId")
            };
            return CommonOperation.DeleteByLogic<PersonBillType>(this, relationList);
        }
    }
}
