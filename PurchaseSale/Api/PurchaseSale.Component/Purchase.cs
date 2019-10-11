using OpenDataAccess.Data;
using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenDataAccess.Utility;
using System.IO;

namespace PurchaseSale.Component
{
    public class Purchase : EntityRequest
    {
        EntityType _PurchaseDetailEntity { get; set; }
        EntityType _ViewPurchaseDetailEntity { get; set; }

        public Purchase()
        {
        }

        public Purchase(Request request)
            : base(request)
        {
            _PurchaseDetailEntity = EntityType.GetEntityType<Entity.PurchaseDetail>();
            _ViewPurchaseDetailEntity = EntityType.GetEntityType<Entity.ViewPurchaseDetail>();
        }

        [Log]
        public object Delete2()
        {
            Guid purchaseId = (Guid)this._QueryRequest.PrimaryKeyProperty.Value;
            new Bill().DeleteBill(purchaseId);

            return CommonOperation.DeleteByLogic<Purchase>(this, null);
        }

        [Log]
        public object Insert2()
        {
            return EditPurchase(false);
        }

        object EditPurchase(bool blUpdate)
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("PurchaseDate", DateTime.Now);
            if (blUpdate)
            {
                entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
                entityData.SetDefaultValue("UpdateDate", DateTime.Now);
            }
            else entityData.SetDefaultValue("CreateUser", this._Request.OperationUser);
            int purchaseCode = GetPurchaseCode(entityData.GetValue<DateTime>("PurchaseDate"));
            if (string.IsNullOrEmpty(entityData.GetStringValue("PurchaseCode")))
            {
                entityData.SetDefaultValue("PurchaseCode", string.Format("P{0}", purchaseCode));
                entityData.SetDefaultValue("PurchaseIntCode", purchaseCode);
            }

            byte purchaseType = entityData.GetValue<byte>("PurchaseType");
            byte incomePayment = 2;
            if (purchaseType == 2) incomePayment = 1;

            byte purchaseStatus = entityData.GetValue<byte>("PurchaseStatus");

            string name = string.Empty;
            Guid billTypeId = Guid.Empty;

            if (purchaseStatus == 1)
            {
                name = purchaseType == 1 ? "采购单" : purchaseType == 2 ? "采购单退货" : "";
                if (string.IsNullOrEmpty(name)) return this.GetMessageDict("未知采购类型！");

                billTypeId = new BillType().GetBillTypeId(name);
                if (billTypeId == Guid.Empty)
                {
                    return this.GetMessageDict("采购单账目类型不存在，请在账目类型中新增名为\"" + name + "\"的账目类型！");
                }
            }

            string remark = purchaseType == 1 ? string.Format("采购单{0}付款", entityData.GetStringValue("PurchaseCode")) : string.Format("采购单退货{0}收款", entityData.GetStringValue("PurchaseCode"));

            object obj = null;
            if (blUpdate) obj = EntityByComplexTypeOperation.Update<Purchase>(this, _PurchaseDetailEntity, "Details");
            else obj = EntityByComplexTypeOperation.Insert<Purchase>(this, _PurchaseDetailEntity, "Details");

            if (obj is Dictionary<string, object> && purchaseStatus == 1)
            {
                Guid purchaseId = Guid.Empty;

                if (blUpdate) purchaseId = (Guid)this._QueryRequest.PrimaryKeyProperty.Value;
                else purchaseId = (obj as Dictionary<string, object>).GetValue<Guid>("PrimaryKey");

                if ((!blUpdate && purchaseId != Guid.Empty) || (blUpdate && (obj as Dictionary<string, object>).ContainsKey("Succeed")))
                {
                    Guid userId = Guid.Parse(this._Request.OperationUser);
                    decimal realAmount = entityData.GetValue<decimal>("RealAmount");
                    if (realAmount > 0) new Bill().EditBill(purchaseId, 1, incomePayment, remark, userId, billTypeId, realAmount, entityData.GetValue<DateTime>("PurchaseDate"));

                    var details = entityData.GetValue<List<Dictionary<string, object>>>("Details");
                    Product product = new Product();
                    details.ForEach(d => product.UpdateBidPrice(d.GetValue<Guid>("ProductId"), d.GetValue<decimal>("BidPrice"), userId));
                }
            }

            return obj;
        }

        [Log]
        public object Update2()
        {
            return EditPurchase(true);
        }


        [Log]
        public object UpdateStatus()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            Guid purchaseId = (Guid)this._QueryRequest.PrimaryKeyProperty.Value;

            IEntityData oldEntityData = this.SelectEntityByPrimaryKey(purchaseId);
            if (oldEntityData == null) return GetMessageDict("采购单信息不存在，请刷新数据！");

            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);

            object obj = this.Update();

            if (obj is Dictionary<string, object> && entityData.GetValue<byte>("PurchaseStatus") == 3 && (obj as Dictionary<string, object>).ContainsKey("Succeed")) new Bill().DeleteBill(purchaseId);

            return obj;
        }

        int GetPurchaseCode(DateTime purchaseDate)
        {
            int ymd = int.Parse(purchaseDate.Date.ToString("yyMMdd"));
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("Max(PurchaseIntCode) PurchaseIntCode");
            query.Where(string.Format("where IsDelete=0 and SUBSTRING(PurchaseCode,2,6)='{0}'", ymd));

            IEntityData entityData = this.SelectEntity(query);

            int purchaseIntCode = entityData.GetValue<int>("PurchaseIntCode");

            if (purchaseIntCode < ymd) purchaseIntCode = ymd * 1000;

            return purchaseIntCode + 1;
        }

        public object GetPurchase()
        {
            return EntityByComplexTypeOperation.GetEntityData<Purchase>(this, _ViewPurchaseDetailEntity, "Details") as IEntityData;
        }
    }

    public class ViewPurchase : EntityRequest
    {
        EntityType _ViewPurchaseDetailEntity { get; set; }

        public ViewPurchase()
        {
        }

        public ViewPurchase(Request request)
            : base(request)
        {
            _ViewPurchaseDetailEntity = EntityType.GetEntityType<Entity.ViewPurchaseDetail>();

            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryBillGroupByInfo(data, wherqSql, parameterList);
        }

        void QueryBillGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select(@"sum(case when PurchaseStatus=3 then 0 else ShouldAmount2 end) as TotalShouldAmount,
                           sum(case when PurchaseStatus=3 then 0 else RealAmount2 end) as TotalRealAmount,
                           sum(case when PurchaseStatus=3 then 0 else DueAmount end) as TotalDueAmount, 
                           sum(case when PurchaseStatus=3 then 0 else PurchaseAmount end) as TotalPurchaseAmount");
            query.Where(whereSql, paramterList);

            IEntityData entityData = this.SelectEntity(query);

            decimal totalShouldAmount = entityData.GetValue<decimal>("TotalShouldAmount");
            decimal totalRealAmount = entityData.GetValue<decimal>("TotalRealAmount");
            decimal totalPurchaseAmount = entityData.GetValue<decimal>("TotalPurchaseAmount");
            decimal totalDueAmount = entityData.GetValue<decimal>("TotalDueAmount");

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("TotalShouldAmount", totalShouldAmount.ToString("C"));
            groupByInfo.SetValue("TotalShouldAmountColor", totalShouldAmount >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalRealAmount", totalRealAmount.ToString("C"));
            groupByInfo.SetValue("TotalRealAmountColor", totalRealAmount >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalPurchaseAmount", totalPurchaseAmount.ToString("C"));
            groupByInfo.SetValue("TotalPurchaseAmountColor", totalPurchaseAmount >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalDueAmount", totalDueAmount.ToString("C"));
            groupByInfo.SetValue("TotalDueAmountColor", totalDueAmount >= 0 ? "#1890ff" : "red");

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public object Select2()
        {
            return this.Select();
        }

        public object GetPurchase()
        {
            return EntityByComplexTypeOperation.GetEntityData<ViewPurchase>(this, _ViewPurchaseDetailEntity, "Details") as IEntityData;
        }
    }
}
