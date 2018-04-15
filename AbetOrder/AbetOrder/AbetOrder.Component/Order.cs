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
    public class Order : EntityRequest
    {
        EntityType _OrderDetailEntity { get; set; }
        EntityType _OrderImageEntity { get; set; }
        Dictionary<string, EntityType> _ComplexDictionary { get; set; }

        public Order()
        {
        }

        public Order(Request request)
            : base(request)
        {
            _OrderDetailEntity = EntityType.GetEntityType<Entity.OrderDetail>();
            _OrderImageEntity = EntityType.GetEntityType<Entity.OrderImage>();
            _ComplexDictionary = new Dictionary<string, EntityType>();
            _ComplexDictionary.Add("Details", _OrderDetailEntity);
            _ComplexDictionary.Add("Images", _OrderImageEntity);
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
            int orderCode= GetOrderCode(entityData.GetValue<DateTime>("OrderDate"));
            if (string.IsNullOrEmpty(entityData.GetStringValue("OrderCode")))
            {
                entityData.SetDefaultValue("OrderCode", orderCode);
                entityData.SetDefaultValue("OrderIntCode", orderCode);
            }

            return EntityByComplexTypeOperation.Insert<Order>(this, _ComplexDictionary);
        }

        [Log]
        public object Update2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("OrderDate", DateTime.Now);
            entityData.SetDefaultValue("SaleUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);
            int orderCode = GetOrderCode(entityData.GetValue<DateTime>("OrderDate"));
            if (string.IsNullOrEmpty(entityData.GetStringValue("OrderCode")))
            {
                entityData.SetDefaultValue("OrderCode", orderCode);
                entityData.SetDefaultValue("OrderIntCode", orderCode);
            }
            return EntityByComplexTypeOperation.Update<Order>(this, _ComplexDictionary);
        }

        [Log]
        public object Update3()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);

            decimal costAmount = entityData.GetValue<decimal>("CostAmount");
            decimal paidDeposit = entityData.GetValue<decimal>("PaidDeposit");

            IEntityData oldEntityData = this.SelectEntityByPrimaryKey(this._QueryRequest.PrimaryKeyProperty.Value);
            if (oldEntityData != null)
            {
                decimal actualAmount = oldEntityData.GetValue<decimal>("ActualAmount");
                decimal processAmount = oldEntityData.GetValue<decimal>("ProcessAmount");

                entityData.SetValue("ShouldPayBalance", actualAmount - paidDeposit);
                entityData.SetValue("Profit", actualAmount - costAmount - processAmount);
            }

            return this.Update();
        }

        [Log]
        public object UpdateStatus()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            Guid orderId = (Guid)this._QueryRequest.PrimaryKeyProperty.Value;

            IEntityData oldEntityData = this.SelectEntityByPrimaryKey(orderId);
            if (oldEntityData == null) return GetMessageDict("订单信息不存在，请刷新数据！");

            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);

            Guid userId = Guid.Parse(this._Request.OperationUser);

            int orderStatus = entityData.GetValue<int>("OrderStatus");
            if (orderStatus == 0)
            {
                if (oldEntityData != null)
                {
                    decimal actualAmount = oldEntityData.GetValue<decimal>("ActualAmount");
                    decimal costAmount = oldEntityData.GetValue<decimal>("CostAmount");

                    entityData.SetValue("Profit", actualAmount - costAmount);
                }
                entityData.SetValue("ProcessAmount", null);
                new DealingsBill().DeleteOrderDealingsBill(orderId);
            }
            else if (orderStatus == 1) GenProcessOrderPdf(orderId);
            else if (orderStatus == 3)
            {
                if (oldEntityData.GetValue<Guid>("CreateUser") != userId) return GetMessageDict("审核加工费需销售员确认操作！");

                return new DealingsBill().CheckProcessAmount(orderId, userId);
            }
            else if (orderStatus == 2)
            {
                int billStatus = new DealingsBill().GetBillStatus(orderId);
                if (billStatus == 0) return GetMessageDict("加工费未审核确认，请先审核加工费！");
            }
            
            return this.Update();
        }

        void GenProcessOrderPdf(Guid orderId)
        {

        }

        int GetOrderCode(DateTime orderDate)
        {
            int ymd = int.Parse(orderDate.Date.ToString("yyMMdd"));
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("Max(OrderIntCode) OrderIntCode");
            query.Where(string.Format("where IsDelete=0 and SUBSTRING(OrderCode,1,6)='{0}'", ymd));

            IEntityData entityData = this.SelectEntity(query);

            int orderIntCode = entityData.GetValue<int>("OrderIntCode");

            if (orderIntCode < ymd) orderIntCode = ymd * 100;

            return orderIntCode + 1;
        }

        public object GetOrder()
        {
            IEntityData entityData = EntityByComplexTypeOperation.GetEntityData<Order>(this, _ComplexDictionary) as IEntityData;

            if (entityData != null)
            {
                entityData.SetValue("BillStatus", new DealingsBill().GetBillStatus(entityData.GetValue<Guid>("OrderId")));
            }

            return entityData;
        }
    }

    public class ViewOrder : EntityRequest
    {
        public ViewOrder()
        {
        }

        public ViewOrder(Request request)
            : base(request)
        {
            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryBillGroupByInfo(data, wherqSql, parameterList);
        }

        void QueryBillGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("sum(ActualAmount) as TotalActualAmount,sum(CostAmount2) as TotalCostAmount2,sum(ProcessAmount2) as TotalProcessAmount2,sum(Profit) as TotalProfit,sum(PaidDeposit) as TotalPaidDeposit,sum(ShouldPayBalance) as TotalShouldPayBalance");
            query.Where(whereSql, paramterList);

            IEntityData entityData = this.SelectEntity(query);

            decimal dotalProfit = entityData.GetValue<decimal>("TotalProfit");

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("TotalActualAmount", entityData.GetValue<decimal>("TotalActualAmount").ToString("C"));
            groupByInfo.SetValue("TotalCostAmount2", entityData.GetValue<decimal>("TotalCostAmount2").ToString("C"));
            groupByInfo.SetValue("TotalProcessAmount2", entityData.GetValue<decimal>("TotalProcessAmount2").ToString("C"));
            groupByInfo.SetValue("TotalProfit", dotalProfit.ToString("C"));
            groupByInfo.SetValue("TotalPaidDeposit", entityData.GetValue<decimal>("TotalPaidDeposit").ToString("C"));
            groupByInfo.SetValue("TotalShouldPayBalance", entityData.GetValue<decimal>("TotalShouldPayBalance").ToString("C"));
            groupByInfo.SetValue("TotalProfitColor", dotalProfit >= 0 ? "#1890ff" : "red");

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public object Select2()
        {
            return this.Select();
        }
    }
}
