using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace AbetAccount.Admin.Component
{
    public class AccountBill : EntityRequest
    {
        public AccountBill()
        {
        }

        public AccountBill(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<AccountBill>(this);
        }
    }

    public class ViewAccountBill : EntityRequest
    {
        EntityType _AdminUserEntity { get; set; }

        public ViewAccountBill()
        {
        }

        public ViewAccountBill(Request request)
            : base(request)
        {
            _AdminUserEntity = EntityType.GetEntityType<Entity.AdminUser>();
            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryBillGroupByInfo(data, wherqSql, parameterList);
        }

        bool JudgeIsAdmin()
        {
            IQuery query = new Query(this._AdminUserEntity.TableName);
            query.Select("IsAdmin");

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@UserId", this._Request.OperationUser));

            query.Where("where IsDelete=0 and IsAdmin=1 and UserId=@UserId", parameterList);

            return this.SelectEntity(query) != null;
        }

        void QueryBillGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("IsIncome,sum(Amount) as Amount,sum(Tax) as Tax");

            if (!_IsAdmin)
            {
                whereSql = this._WhereSql;
                paramterList.Add(this.InParameter("@CreateUser", _Request.OperationUser));
            }
            query.Where(whereSql, paramterList);
            query.GroupBy("group by IsIncome");

            List<IEntityData> list = this.SelectEntities(query);

            IEntityData incomeData = list.Where(w => w.GetValue<byte>("IsIncome") == 1).FirstOrDefault();
            decimal income = 0;
            decimal outlayTax = 0;

            if (incomeData != null)
            {
                income = incomeData.GetValue<decimal>("Amount");
                outlayTax = incomeData.GetValue<decimal>("Tax");
            }

            IEntityData outlayData = list.Where(w => w.GetValue<byte>("IsIncome") == 0).FirstOrDefault();
            decimal outlay = 0;
            decimal incomeTax = 0;
            if (outlayData != null)
            {
                outlay = outlayData.GetValue<decimal>("Amount");
                incomeTax = outlayData.GetValue<decimal>("Tax");
            }

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("TotalIncome", income.ToString("C"));
            groupByInfo.SetValue("TotalOutlay", (0 - outlay).ToString("C"));
            groupByInfo.SetValue("TotalBalance", (income - outlay).ToString("C"));
            groupByInfo.SetValue("TotalBalanceColor", income - outlay >= 0 ? "#1890ff" : "red");

            groupByInfo.SetValue("TotalIncomeTax", incomeTax.ToString("C"));
            groupByInfo.SetValue("TotalOutlayTax", (0 - outlayTax).ToString("C"));
            groupByInfo.SetValue("TotalBalanceTax", (incomeTax - outlayTax).ToString("C"));
            groupByInfo.SetValue("TotalBalanceTaxColor", incomeTax - outlayTax >= 0 ? "#1890ff" : "red");

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public bool _IsAdmin { get; set; }

        public string _WhereSql { get; set; }

        public object Select2()
        {
            this._IsAdmin = this.JudgeIsAdmin();
            if (!this._IsAdmin)
            {
                var whereSql = this._QueryRequest.QueryInfo.WhereSql;
                if (string.IsNullOrEmpty(whereSql)) whereSql = "where CreateUser=@CreateUser";
                else whereSql += " and CreateUser=@CreateUser";

                _WhereSql = whereSql;

                var parameterList = this._QueryRequest.QueryInfo.ParameterList ?? new List<IDbDataParameter>();
                parameterList.Add(this.InParameter("@CreateUser", _Request.OperationUser));

                this._QueryRequest.QueryInfo.WhereSql = whereSql;
                this._QueryRequest.QueryInfo.ParameterList = parameterList;
            }
            return this.Select();
        }
    }
}
