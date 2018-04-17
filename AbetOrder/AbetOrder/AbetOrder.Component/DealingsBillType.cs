using OpenDataAccess.Data;
using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class DealingsBillType : EntityRequest
    {
        public DealingsBillType()
        {
            this.EntityType = EntityType.GetEntityType<Entity.DealingsBillType>();
        }

        public DealingsBillType(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.DealingsBill>(),"此往来类型存在被引用，不能删除，请先取消支业务往来引用！", "BillTypeId")      
            };
            return CommonOperation.DeleteByLogic<DealingsBillType>(this, relationList);
        }

        public Guid GetOrderProcessBillTypeId()
        {
            IEntityData entityData = GetOrderProcessBillType();
            if (entityData == null)
            {
                entityData = new EntityData(this.EntityType);
                entityData.SetValue("Name", "订单加工费");
                entityData.SetValue("IncomePayment", 0);
                entityData.SetValue("Remark", "用于业务往来订单加工费");

                object primaryKey = null;
                this.InsertEntity(entityData, out primaryKey);

                return (Guid)primaryKey;
            }
            return entityData.GetValue<Guid>("Id");
        }

        IEntityData GetOrderProcessBillType()
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("Id");
            query.Where("where IsDelete=0 and Name='订单加工费'");
            return this.SelectEntity(query);
        }
    }
}
