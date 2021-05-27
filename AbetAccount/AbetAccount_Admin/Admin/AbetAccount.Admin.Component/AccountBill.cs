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
        EntityType _AdminUserEntity { get; set; }

        public AccountBill()
        {
            EntityType= EntityType.GetEntityType<Entity.AccountBill>();
            _AccountItemEntity = EntityType.GetEntityType<Entity.AccountItem>();
            _AccountCategoryEntity = EntityType.GetEntityType<Entity.AccountCategory>();
            _AdminUserEntity = EntityType.GetEntityType<Entity.AdminUser>();
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
            query.Select("CategoryId,AccountItemId,Name");

            query.Where("where IsDelete=0");

            return this.SelectEntities(query);
        }

        List<IEntityData> GetAdminUserList()
        {
            IQuery query = new Query(this._AdminUserEntity.TableName);
            query.Select("UserId,UserName");

            query.Where("where IsDelete=0");

            return this.SelectEntities(query);
        }

        public string ExcelImport(List<Dictionary<string, object>> dictList, string loginUserId, List<Dictionary<string, object>> messageList)
        {

            string message = string.Empty;

            List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();
            List<Dictionary<string, object>> accountItemDataList = new List<Dictionary<string, object>>();
            List<Dictionary<string, object>> accountCategoryDataList = new List<Dictionary<string, object>>();
            List<Dictionary<string, object>> adminUserDataList = new List<Dictionary<string, object>>();

            Dictionary<string, object> data = null;
            Dictionary<string, object> dict = null;
            Dictionary<string, object> msg = null;
            Dictionary<string, object> item = null;
            List<string> msgList = null;

            List<IEntityData> accountItemList = GetAccountItemList();
            List<IEntityData> accountCategoryList = GetAccountCategoryList();
            List<IEntityData> adminUserList = GetAdminUserList();

            DateTime now = DateTime.Now;

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

                //账目名称
                string itemName = dict.GetStringValue("账目名称");
                IEntityData entityData = accountItemList.Where(w => w.GetStringValue("Name") == itemName).FirstOrDefault();
                if (entityData == null)
                {
                    item = new Dictionary<string, object>();
                    Guid id = Guid.NewGuid();

                    item.Add("ItemId", id);
                    item.Add("Name", itemName);
                    item.Add("DisplayIndex", 1);
                    item.Add("Remark", "Excel导入");
                    item.Add("CreateUser", loginUserId);
                    item.Add("CreateDate", now);
                    accountItemDataList.Add(item);

                    accountItemList.Add(new EntityData(item));

                    data.Add("AccountItemId", id);
                }
                else data.Add("AccountItemId", entityData.GetValue("ItemId"));

                //收支
                data.Add("IncomeOutlay", dict.GetStringValue("收支") == "收入" ? 1 : 2);

                //类别
                Guid accountItemId = data.GetValue<Guid>("accountItemId");
                string categoryName = dict.GetStringValue("类别");
                entityData = accountCategoryList.Where(w => w.GetValue<Guid>("AccountItemId") == accountItemId && w.GetStringValue("Name") == categoryName).FirstOrDefault();
                if (entityData == null)
                {
                    item = new Dictionary<string, object>();
                    Guid id = Guid.NewGuid();

                    item.Add("CategoryId", id);
                    item.Add("Name", categoryName);
                    item.Add("AccountItemId", accountItemId);
                    item.Add("Remark", "Excel导入");
                    item.Add("CreateUser", loginUserId);
                    item.Add("CreateDate", now);
                    accountCategoryDataList.Add(item);

                    accountCategoryList.Add(new EntityData(item));

                    data.Add("AccountCategoryId", id);
                }
                else data.Add("AccountCategoryId", entityData.GetValue("CategoryId"));

                //金额
                decimal amount = 0;
                string dStr = dict.GetStringValue("金额");
                if (decimal.TryParse(dStr, out amount))
                {
                    data.Add("Amount", amount);
                }
                else
                {
                    msgList.Add(string.Format("金额:{0}格式不正确，应为金额数值", dStr));
                }

                //摘要
                data.Add("Remark", dict.GetValue("摘要"));

                //账户
                data.Add("AccountType", dict.GetStringValue("账户") == "上海阿贝特实业有限公司" ? 1 : 0);

                //经手人
                string userName = dict.GetStringValue("经手人");
                Guid userId = Guid.Parse(loginUserId);
                if (!string.IsNullOrEmpty(userName))
                {
                    entityData = adminUserList.Where(w => w.GetStringValue("UserName") == userName).FirstOrDefault();
                    if (entityData == null)
                    {
                        item = new Dictionary<string, object>();
                        Guid id = Guid.NewGuid();

                        item.Add("UserId", id);
                        item.Add("UserName", userName);
                        item.Add("LoginUser", userName);
                        item.Add("LoginPassword", "e10adc3949ba59abbe56e057f20f883e");
                        item.Add("Remark", "Excel导入");
                        item.Add("CreateUser", loginUserId);
                        item.Add("CreateDate", now);
                        adminUserDataList.Add(item);

                        adminUserList.Add(new EntityData(item));

                        userId = id;
                    }
                    else userId = entityData.GetValue<Guid>("UserId");
                }
                data.Add("BillUser", userId);

                data.Add("CreateDate", now);
                data.Add("BillId", Guid.NewGuid());
                data.Add("CreateUser", loginUserId);
                dataList.Add(data);

                if (msgList.Count > 0)
                {
                    msg.Add("RowNum", i + 1);
                    msg.Add("Message", string.Join("；", msgList));
                    messageList.Add(msg);
                }
            }

            if (messageList.Count > 0) return message;

            BulkCopyInsert(dataList);
            if (accountItemDataList.Count > 0) AccountItemBulkCopyInsert(accountItemDataList);
            if (accountCategoryDataList.Count > 0) AccountCategoryBulkCopyInsert(accountCategoryDataList);
            if (adminUserDataList.Count > 0) AdminUserBulkCopyInsert(adminUserDataList);

            return message;
        }

        /// <summary>
        /// 批量插入
        /// </summary>
        /// <param name="dictList"></param>
        /// <returns></returns>
        public void AdminUserBulkCopyInsert(List<Dictionary<string, object>> dictList)
        {
            ((ISqlDataBase)this.CurrentDataBase).SqlBulkCopyInsert(AdminUserDictionaryListToDataTable(dictList), this._AdminUserEntity.TableName);
        }

        private DataTable AdminUserDictionaryListToDataTable(List<Dictionary<string, object>> dictList)
        {
            DateTime createDate = DateTime.Now;

            DataTable dt = new DataTable();

            dt.Columns.Add(new DataColumn("UserId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("UserName", typeof(string)));
            dt.Columns.Add(new DataColumn("LoginName", typeof(string)));
            dt.Columns.Add(new DataColumn("LoginPassword", typeof(string)));
            dt.Columns.Add(new DataColumn("Remark", typeof(string)));
            dt.Columns.Add(new DataColumn("CreateUser", typeof(Guid)));
            dt.Columns.Add(new DataColumn("CreateDate", typeof(DateTime)));

            DataRow dr = null;

            dictList.ForEach(dict =>
            {
                dr = dt.NewRow();
                foreach (DataColumn column in dt.Columns)
                {
                    dr[column.ColumnName] = dict[column.ColumnName];
                }

                dt.Rows.Add(dr);
            });
            return dt;
        }

        /// <summary>
        /// 批量插入
        /// </summary>
        /// <param name="dictList"></param>
        /// <returns></returns>
        public void AccountCategoryBulkCopyInsert(List<Dictionary<string, object>> dictList)
        {
            ((ISqlDataBase)this.CurrentDataBase).SqlBulkCopyInsert(AccountCategoryDictionaryListToDataTable(dictList), this._AccountCategoryEntity.TableName);
        }

        private DataTable AccountCategoryDictionaryListToDataTable(List<Dictionary<string, object>> dictList)
        {
            DateTime createDate = DateTime.Now;

            DataTable dt = new DataTable();

            dt.Columns.Add(new DataColumn("CategoryId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("Name", typeof(string)));
            dt.Columns.Add(new DataColumn("AccountItemId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("Remark", typeof(string)));
            dt.Columns.Add(new DataColumn("CreateUser", typeof(Guid)));
            dt.Columns.Add(new DataColumn("CreateDate", typeof(DateTime)));

            DataRow dr = null;

            dictList.ForEach(dict =>
            {
                dr = dt.NewRow();
                foreach (DataColumn column in dt.Columns)
                {
                    dr[column.ColumnName] = dict[column.ColumnName];
                }

                dt.Rows.Add(dr);
            });
            return dt;
        }


        /// <summary>
        /// 批量插入
        /// </summary>
        /// <param name="dictList"></param>
        /// <returns></returns>
        public void AccountItemBulkCopyInsert(List<Dictionary<string, object>> dictList)
        {
            ((ISqlDataBase)this.CurrentDataBase).SqlBulkCopyInsert(AccountItemDictionaryListToDataTable(dictList), this._AccountItemEntity.TableName);
        }

        private DataTable AccountItemDictionaryListToDataTable(List<Dictionary<string, object>> dictList)
        {
            DateTime createDate = DateTime.Now;

            DataTable dt = new DataTable();

            dt.Columns.Add(new DataColumn("ItemId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("Name", typeof(string)));
            dt.Columns.Add(new DataColumn("DisplayIndex", typeof(int)));
            dt.Columns.Add(new DataColumn("Remark", typeof(string)));
            dt.Columns.Add(new DataColumn("CreateUser", typeof(Guid)));
            dt.Columns.Add(new DataColumn("CreateDate", typeof(DateTime)));

            DataRow dr = null;

            dictList.ForEach(dict =>
            {
                dr = dt.NewRow();
                foreach (DataColumn column in dt.Columns)
                {
                    dr[column.ColumnName] = dict[column.ColumnName];
                }

                dt.Rows.Add(dr);
            });
            return dt;
        }

        /// <summary>
        /// 批量插入
        /// </summary>
        /// <param name="dictList"></param>
        /// <returns></returns>
        public void BulkCopyInsert(List<Dictionary<string, object>> dictList)
        {
            ((ISqlDataBase)this.CurrentDataBase).SqlBulkCopyInsert(DictionaryListToDataTable(dictList), this.EntityType.TableName);
        }

        private DataTable DictionaryListToDataTable(List<Dictionary<string, object>> dictList)
        {
            DateTime createDate = DateTime.Now;

            DataTable dt = new DataTable();

            dt.Columns.Add(new DataColumn("BillId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("AccountCategoryId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("AccountItemId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("IncomeOutlay", typeof(byte)));
            dt.Columns.Add(new DataColumn("AccountType", typeof(byte)));
            dt.Columns.Add(new DataColumn("Amount", typeof(decimal)));
            dt.Columns.Add(new DataColumn("BillDate", typeof(DateTime)));
            dt.Columns.Add(new DataColumn("BillUser", typeof(Guid)));
            dt.Columns.Add(new DataColumn("Remark", typeof(string)));
            dt.Columns.Add(new DataColumn("CreateUser", typeof(Guid)));
            dt.Columns.Add(new DataColumn("CreateDate", typeof(DateTime)));

            DataRow dr = null;

            dictList.ForEach(dict =>
            {
                dr = dt.NewRow();
                foreach (DataColumn column in dt.Columns)
                {
                    dr[column.ColumnName] = dict[column.ColumnName];
                }

                dt.Rows.Add(dr);
            });
            return dt;
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
            query.Select("IncomeOutlay,sum(Amount) as Amount");

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

            if (incomeData != null)
            {
                income = incomeData.GetValue<decimal>("Amount");
            }

            IEntityData outlayData = list.Where(w => w.GetValue<byte>("IncomeOutlay") == 0).FirstOrDefault();
            decimal outlay = 0;
            if (outlayData != null)
            {
                outlay = outlayData.GetValue<decimal>("Amount");
            }

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("TotalIncome", income.ToString("C"));
            groupByInfo.SetValue("TotalOutlay", (0 - outlay).ToString("C"));
            groupByInfo.SetValue("TotalBalance", (income - outlay).ToString("C"));
            groupByInfo.SetValue("TotalBalanceColor", income - outlay >= 0 ? "#1890ff" : "red");

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
