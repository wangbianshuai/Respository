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
    public class StockCheck : EntityRequest
    {
        public StockCheck()
        {
        }

        public StockCheck(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<StockCheck>(this, null);
        }
    }

    public class ViewStockCheck : EntityRequest
    {
        public ViewStockCheck()
        {
        }

        public ViewStockCheck(Request request)
            : base(request)
        {
            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryProductGroupByInfo(data, wherqSql, parameterList);
        }

        void QueryProductGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("sum(LossAmount) as CostAmount");
            query.Where(whereSql, paramterList);

            IEntityData entityData = this.SelectEntity(query);

            decimal costAmount = entityData.GetValue<decimal>("CostAmount");

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("CostAmount", costAmount.ToString("C"));
            groupByInfo.SetValue("CostAmountColor", costAmount >= 0 ? "#1890ff" : "red");

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public object Select2()
        {
            return this.Select();
        }
    }
}
