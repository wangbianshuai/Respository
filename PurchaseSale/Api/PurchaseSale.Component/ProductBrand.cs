using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Component
{
    public class ProductBrand : EntityRequest
    {
        public ProductBrand()
        {
        }

        public ProductBrand(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.Product>(),"此商品品牌存在被引用，不能删除，请先删除商品中引用！", "ProductBrandId")
            };
            return CommonOperation.DeleteByLogic<ProductBrand>(this, relationList);
        }
    }
}
