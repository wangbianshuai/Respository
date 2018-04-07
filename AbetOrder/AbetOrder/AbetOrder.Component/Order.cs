using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class Order : EntityRequest
    {
        EntityType _OrderDetailEntity { get; set; }
        EntityType _OrderImageEntity { get; set; }
        Dictionary<string, EntityType> _ComplexDictionay { get; set; }

        public Order()
        {
        }

        public Order(Request request)
            : base(request)
        {
            _OrderDetailEntity = EntityType.GetEntityType<Entity.OrderDetail>();
            _OrderImageEntity = EntityType.GetEntityType<Entity.OrderImage>();
            _ComplexDictionay = new Dictionary<string, EntityType>();
            _ComplexDictionay.Add("Details", _OrderDetailEntity);
            _ComplexDictionay.Add("Images", _OrderImageEntity);
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<Order>(this);
        }

        [Log]
        public object Insert2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("OrderDate", DateTime.Now);
            entityData.SetDefaultValue("SaleUser", this._Request.OperationUser);
            entityData.SetDefaultValue("CreateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);
            entityData.SetDefaultValue("OrderCode", GetOrderCode());

            return EntityByComplexTypeOperation.Insert<Order>(this, _ComplexDictionay);
        }

        [Log]
        public object Update2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("OrderDate", DateTime.Now);
            entityData.SetDefaultValue("SaleUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);
            entityData.SetDefaultValue("OrderCode", GetOrderCode());

            return EntityByComplexTypeOperation.Update<Order>(this, _ComplexDictionay);
        }

        string GetOrderCode()
        {
            return DateTime.Now.ToString("yyMMddHHmmssfff") + new Random().Next(10, 99);
        }

        public object GetOrder()
        {
            return EntityByComplexTypeOperation.GetEntityData<Order>(this, _ComplexDictionay);
        }
    }
}
