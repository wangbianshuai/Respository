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

            decimal processAmount = entityData.GetValue<decimal>("ProcessAmount");

            if (processAmount == oldEntityData.GetValue<decimal>("ProcessAmount")) return GetMessageDict("加工费其值未变化，无需更新！");

            Guid saleUser = oldEntityData.GetValue<Guid>("SaleUser");
            Guid userId = Guid.Parse(this._Request.OperationUser);

            if (saleUser == userId) return GetMessageDict("加工费修改人不能为销售员自己！");

            oldEntityData.SetValue("ProcessAmount", entityData.GetValue("ProcessAmount"));

            DealingsBill bill = new DealingsBill();

            Guid processBookId = Guid.Parse(System.Configuration.ConfigurationManager.AppSettings["ProcessBookId"]);

            if (!JudgeBookUser(processBookId, userId)) return GetMessageDict("订单加工费验证记账人失败，请联系管理员！");

            if (!bill.EditOrderDealignsBill(oldEntityData, userId, processBookId)) return GetMessageDict("添加订单加工费往来失败，请刷新数据再试！");

            decimal actualAmount = oldEntityData.GetValue<decimal>("ActualAmount");
            decimal costAmount = oldEntityData.GetValue<decimal>("CostAmount");

            entityData.SetValue("Profit", actualAmount - costAmount - processAmount);

            return this.Update();
        }

        bool JudgeBookUser(Guid processBookId, Guid userId)
        {
            IQuery query = new Query("t_d_DealingsBookUser");
            query.Select("Id");
            query.Where(string.Format("where BookId='{0}' and UserId='{1}'", processBookId, userId));

            return this.SelectEntity(query) != null;
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
