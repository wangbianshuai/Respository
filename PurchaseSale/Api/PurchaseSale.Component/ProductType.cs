using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Component
{
    public class ProductType : EntityRequest
    {
        public ProductType()
        {
        }

        public ProductType(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.Product>(),"此商品类型存在被引用，不能删除，请先删除商品中引用！", "ProductTypeId")
            };
            return CommonOperation.DeleteByLogic<ProductType>(this, relationList);
        }
    }
}
