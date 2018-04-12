using OpenDataAccess.Data;
using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class ProcessOrder : EntityRequest
    {

        public ProcessOrder()
        {
        }

        public ProcessOrder(Request request)
            : base(request)
        {
        }


        [Log]
        public object Update2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            IEntityData oldEntityData = this.SelectEntityByPrimaryKey(this._QueryRequest.PrimaryKeyProperty.Value);

            if (oldEntityData == null) return GetMessageDict("更新数据不存在，请刷新数据！");

            if (entityData.GetValue<decimal>("ProcessAmount") == oldEntityData.GetValue<decimal>("ProcessAmount")) return GetMessageDict("加工费其值未变化，无需更新！");

            Guid saleUser = oldEntityData.GetValue<Guid>("SaleUser");

            if (saleUser == Guid.Parse(this._Request.OperationUser)) return GetMessageDict("加工费修改人不能为销售员");

            oldEntityData.SetValue("ProcessAmount", entityData.GetValue("ProcessAmount"));

            DealingsBill bill = new DealingsBill();
            if (!bill.EditOrderDealignsBill(oldEntityData)) return GetMessageDict("添加订单加工费往来失败，请刷新数据再试！");

            return this.Update();
        }
    }

    public class ViewProcessOrder : EntityRequest
    {
        public ViewProcessOrder()
        {
        }

        public ViewProcessOrder(Request request)
            : base(request)
        {
            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryBillGroupByInfo(data, wherqSql, parameterList);
        }

        void QueryBillGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("sum(ProcessAmount) as TotalProcessAmount");
            query.Where(whereSql, paramterList);

            IEntityData entityData = this.SelectEntity(query);

            decimal dotalProfit = entityData.GetValue<decimal>("TotalProfit");

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("TotalProcessAmount", entityData.GetValue<decimal>("TotalProcessAmount").ToString("C"));

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public object Select2()
        {
            return this.Select();
        }
    }
}
