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
    public class Bill : EntityRequest
    {
        public Bill()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Bill>();
        }

        public Bill(Request request)
            : base(request)
        {
        }

        public bool DeleteOrderBill(Guid orderId)
        {
            Guid billTypeId = Guid.Parse(System.Configuration.ConfigurationManager.AppSettings["PaidDepositBillTypeId"]);

            IEntityData bill = GetOrderPaidDepositBill(orderId, billTypeId);

            if (bill != null)
            {
                IEntityData data = new EntityData(this.EntityType);

                object id = bill.GetValue("Id");
                data.SetValue("Id", id);
                data.SetValue("IsDelete", 1);

                return this.UpdateEntityByPrimaryKey(id, data);
            }

            return true;
        }

        public bool EditBill(Guid orderId, string orderCode, Guid userId, decimal amount, DateTime billDate)
        {
            Guid billTypeId = Guid.Parse(System.Configuration.ConfigurationManager.AppSettings["PaidDepositBillTypeId"]);
            IEntityData bill = GetOrderPaidDepositBill(orderId);
            IEntityData data = new EntityData(this.EntityType);

            data.SetValue("Amount", amount);
            data.SetValue("Remark", string.Format("订单编号{0}收款", orderCode));
            data.SetValue("BillTypeId", billTypeId);
            data.SetValue("UpdateDate", DateTime.Now);
            data.SetValue("IncomePayment", 1);
            data.SetValue("BillDate", billDate);

            if (bill == null)
            {
                data.SetValue("DataId", orderId);
                data.SetValue("DataType", 1);
                data.SetValue("CreateUser", userId);

                object primaryKey = null;
                return this.InsertEntity(data, out primaryKey);
            }
            else
            {
                object id = bill.GetValue("Id");
                data.SetValue("Id", id);
                data.SetValue("UpdateDate", DateTime.Now);

                return this.UpdateEntityByPrimaryKey(id, data);
            }
        }

        IEntityData GetOrderPaidDepositBill(Guid orderId)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("Id,BillStatus");
            query.Where(string.Format("where IsDelete=0 and DataType=1 and DataId='{0}'", orderId));

            return this.SelectEntity(query);
        }

        IEntityData GetOrderPaidDepositBill(Guid orderId, Guid billTypeId)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("Id,BillStatus");
            query.Where(string.Format("where IsDelete=0 and DataType=1 and DataId='{0}' and BillTypeId='{1}'", orderId, billTypeId));

            return this.SelectEntity(query);
        }

        [Log]
        public object Insert2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("BillDate", DateTime.Now);
            entityData.SetDefaultValue("CreateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);

            return this.Insert();
        }

        [Log]
        public object Update2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("BillDate", DateTime.Now);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);

            return this.Update();
        }

        [Log]
        public object UpdateStatus()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("ApproveUser", this._Request.OperationUser);
            entityData.SetDefaultValue("ApproveDate", DateTime.Now);

            return this.Update();
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<Bill>(this, null);
        }
    }

    public class ViewBill : EntityRequest
    {
        public ViewBill()
        {
        }

        public ViewBill(Request request)
            : base(request)
        {
            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryBillGroupByInfo(data, wherqSql, parameterList);
        }

        void QueryBillGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("IncomePayment,sum(Amount) as Amount");
            query.Where(whereSql, paramterList);
            query.GroupBy("group by IncomePayment");

            List<IEntityData> list = this.SelectEntities(query);

            IEntityData incomeData = list.Where(w => w.GetValue<byte>("IncomePayment") == 1).FirstOrDefault();
            decimal income = incomeData == null ? 0 : incomeData.GetValue<decimal>("Amount");

            IEntityData paymentData = list.Where(w => w.GetValue<byte>("IncomePayment") == 2).FirstOrDefault();
            decimal payment = paymentData == null ? 0 : paymentData.GetValue<decimal>("Amount");

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("TotalIncome", income.ToString("C"));
            groupByInfo.SetValue("TotalPayment", (0 - payment).ToString("C"));
            groupByInfo.SetValue("TotalBalance", (income - payment).ToString("C"));
            groupByInfo.SetValue("TotalBalanceColor", income - payment >= 0 ? "#1890ff" : "red");

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public object Select2()
        {
            return this.Select();
        }
    }
}
