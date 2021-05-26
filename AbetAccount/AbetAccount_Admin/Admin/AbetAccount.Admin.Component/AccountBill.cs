using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace AbetAccount.Admin.Component
{
    public class AccountBill : EntityRequest
    {
        EntityType _AccountItemEntity { get; set; }
        EntityType _AccountCategoryEntity { get; set; }


        public AccountBill()
        {
            EntityType= EntityType.GetEntityType<Entity.AccountBill>();
            _AccountItemEntity = EntityType.GetEntityType<Entity.AccountItem>();
            _AccountCategoryEntity = EntityType.GetEntityType<Entity.AccountCategory>();
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

        List<IEntityData> GetAccountItemList()
        {
            IQuery query = new Query(this._AccountItemEntity.TableName);
            query.Select("ItemId,Name");

            query.Where("where IsDelete=0");

            return this.SelectEntities(query);
        }

        List<IEntityData> GetAccountCategoryList()
        {
            IQuery query = new Query(this._AccountCategoryEntity.TableName);
            query.Select("CategoryId,IncomeOutlay,Name");

            query.Where("where IsDelete=0");

            return this.SelectEntities(query);
        }

        public string ExcelImport(List<Dictionary<string, object>> dictList, string loginUserId, List<Dictionary<string, object>> messageList)
        {

            string message = string.Empty;

            List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();

            Dictionary<string, object> data = null;
            Dictionary<string, object> dict = null;
            Dictionary<string, object> msg = null;
            List<string> msgList = null;

            List<IEntityData> accountItemList = GetAccountItemList();
            List<IEntityData> accountCategoryList = GetAccountCategoryList();

            for (int i = 0; i < dictList.Count; i++)
            {
                dict = dictList[i];
                data = new Dictionary<string, object>();
                msg = new Dictionary<string, object>();
                msgList = new List<string>();

                //日期
                DateTime date;
                string dateStr = dict.GetStringValue("日期");
                if (DateTime.TryParse(dateStr, out date))
                {
                    data.Add("BillDate", date.Date);
                }
                else
                {
                    msgList.Add(string.Format("日期:{0}格式不正确，请参与格式:2021-05-26", dateStr));
                }

                //实体项目
                string itemName = dict.GetStringValue("实体项目");
                IEntityData entityData = accountItemList.Where(w => w.GetStringValue("Name") == itemName).FirstOrDefault();
                if (entityData == null)
                {
                    msgList.Add(string.Format("实体项目:{0}不存在，请先在实体项目中添加", itemName));
                }
                else data.Add("AccountItemId", entityData.GetValue("ItemId"));

                //收支
                string incomeOutlayName = dict.GetStringValue("收支");
                int incomeOutlay = dict.GetStringValue("收支") == "收入" ? 1 : 2;
                data.Add("IncomeOutlay", incomeOutlay);

                //类别
                string categoryName = dict.GetStringValue("类别");
                entityData = accountCategoryList.Where(w => w.GetValue<int>("IncomeOutlay") == incomeOutlay && w.GetStringValue("Name") == categoryName).FirstOrDefault();
                if (entityData == null)
                {
                    msgList.Add(string.Format("收支:{0},类别:{1}不存在，请先在类别中添加", incomeOutlayName, categoryName));
                }
                else data.Add("AccountCategoryId", entityData.GetValue("CategoryId"));

                //金额
                decimal amount = 0;
                string dStr = dict.GetStringValue("金额");
                if (decimal.TryParse(dStr, out amount))
                {

                }
                else
                {
                    msgList.Add(string.Format("金额:{0}格式不正确，应为金额数值", dStr));
                }

                if (msgList.Count > 0)
                {
                    msg.Add("RowNum", i + 1);
                    msg.Add("MessageList", string.Join("；", msgList));
                    messageList.Add(msg);
                }
            }

            return message;
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

        bool JudgeDataRight()
        {
            IQuery query = new Query(this._AdminUserEntity.TableName);
            query.Select("DataRight");

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@UserId", this._Request.OperationUser));

            query.Where("where IsDelete=0 and DataRight=1 and UserId=@UserId", parameterList);

            return this.SelectEntity(query) != null;
        }

        void QueryBillGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("IncomeOutlay,sum(Amount) as Amount,sum(Tax) as Tax");

            if (!_IsAllData)
            {
                whereSql = this._WhereSql;
                paramterList.Add(this.InParameter("@CreateUser", _Request.OperationUser));
            }
            query.Where(whereSql, paramterList);
            query.GroupBy("group by IncomeOutlay");

            List<IEntityData> list = this.SelectEntities(query);

            IEntityData incomeData = list.Where(w => w.GetValue<byte>("IncomeOutlay") == 1).FirstOrDefault();
            decimal income = 0;
            decimal outlayTax = 0;

            if (incomeData != null)
            {
                income = incomeData.GetValue<decimal>("Amount");
                outlayTax = incomeData.GetValue<decimal>("Tax");
            }

            IEntityData outlayData = list.Where(w => w.GetValue<byte>("IncomeOutlay") == 0).FirstOrDefault();
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

        public bool _IsAllData { get; set; }

        public string _WhereSql { get; set; }

        public object Select2()
        {
            this._IsAllData = this.JudgeDataRight();
            if (!this._IsAllData)
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
