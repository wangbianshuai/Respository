using OpenDataAccess.Data;
using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Data;
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

        public Guid GetBillTypeId(string name)
        {
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.CurrentDataBase.InParameter("@Name", name));

            IQuery query = new Query(this.EntityType.TableName);
            query.Select("Id");
            query.Where("where IsDelete=0 and Name =@Name", parameterList);
            IEntityData entityData = this.SelectEntity(query);

            if (entityData != null)
            {
                return entityData.GetValue<Guid>("Id");
            }

            return Guid.Empty;
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
