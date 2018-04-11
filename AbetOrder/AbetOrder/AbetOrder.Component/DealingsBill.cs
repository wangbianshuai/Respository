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
    public class DealingsBill : EntityRequest
    {
        public DealingsBill()
        {
        }

        public DealingsBill(Request request)
            : base(request)
        {
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

            entityData.SetDefaultValue("ApproveDate", DateTime.Now);

            return this.Update();
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<DealingsBill>(this);
        }
    }

    public class ViewDealingsBill : EntityRequest
    {
        public ViewDealingsBill()
        {
        }

        public ViewDealingsBill(Request request)
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
            groupByInfo.SetValue("TotalPayment", payment.ToString("C"));
            groupByInfo.SetValue("TotalBalance", (income - payment).ToString("C"));
            groupByInfo.SetValue("TotalBalanceColor", income - payment >= 0 ? "#1890ff" : "red");

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public object Select2()
        {
            var whereField = this._QueryRequest.QueryInfo.WhereFields.Where(w => w.Name == "CreateUser2" && w.Value == this._Request.OperationUser).FirstOrDefault();
            if (whereField == null) return GetMessageDict("查询用户不是当前用户,请重新登录！");

            whereField = this._QueryRequest.QueryInfo.WhereFields.Where(w => w.Name == "DealingsUser2" && !string.IsNullOrEmpty(w.Value)).FirstOrDefault();
            if (whereField == null) return GetMessageDict("查询未有往来用户");

            return this.Select();
        }
    }

    public class ViewDealingsBillUser : EntityRequest
    {
        public ViewDealingsBillUser()
        {
        }

        public ViewDealingsBillUser(Request request)
            : base(request)
        {
        }

        public object Select2()
        {
            var whereField = this._QueryRequest.QueryInfo.WhereFields.Where(w => w.Name == "CreateUser" && w.Value == this._Request.OperationUser).FirstOrDefault();
            if (whereField == null) return GetMessageDict("查询用户不是当前用户,请重新登录！");

            return this.Select();
        }
    }
}
