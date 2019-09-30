using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using OpenDataAccess.Data;

namespace PurchaseSale.Component
{
    public class Product : EntityRequest
    {
        public Product()
        {
        }

        public Product(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<Product>(this, null);
        }

        [Log]
        public object UpdateStatus()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);

            return this.Update();
        }
    }

    public class ViewProduct : EntityRequest
    {
        public ViewProduct()
        {
        }

        public ViewProduct(Request request)
            : base(request)
        {
            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryProductGroupByInfo(data, wherqSql, parameterList);
        }

        void QueryProductGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("sum(BidPrice*CurrentStock) as CostAmount,sum(SillingPrice*CurrentStock) as CanSaleAmount");
            query.Where(whereSql, paramterList);

            IEntityData entityData = this.SelectEntity(query);

            decimal costAmount = entityData.GetValue<decimal>("CostAmount");
            decimal canSaleAmount = entityData.GetValue<decimal>("CanSaleAmount");

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("CostAmount", costAmount.ToString("C"));
            groupByInfo.SetValue("CanSaleAmount", canSaleAmount.ToString("C"));
            groupByInfo.SetValue("CanSaleAmountColor", canSaleAmount >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("CostAmountColor", costAmount >= 0 ? "#1890ff" : "red");

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public object Select2()
        {
            return this.Select();
        }
    }
}
