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

        public bool DeleteBill(Guid dataId)
        {
            string sql = string.Format("update t_Bill set IsDelete=1 where DataId='{0}'", dataId);
            return this.CurrentDataBase.ExecSqlNonQuery(sql);
        }

        public bool EditBill(Guid dataId, byte dataType, byte incomePayment, string remark, Guid userId, Guid billTypeId, decimal amount, DateTime billDate)
        {
            DeleteBill(dataId);

            IEntityData data = new EntityData(this.EntityType);

            data.SetValue("Amount", amount);
            data.SetValue("Remark", remark);
            data.SetValue("DataId", dataId);
            data.SetValue("DataType", dataType);
            data.SetValue("BillTypeId", billTypeId);
            data.SetValue("CreateUser", userId);
            data.SetValue("IncomePayment", incomePayment);
            data.SetValue("BillDate", billDate);

            object primaryKey = null;
            return this.InsertEntity(data, out primaryKey);
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
