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
    public class Sale : EntityRequest
    {
        EntityType _SaleDetailEntity { get; set; }
        EntityType _ViewSaleDetailEntity { get; set; }

        public Sale()
        {
        }

        public Sale(Request request)
            : base(request)
        {
            _SaleDetailEntity = EntityType.GetEntityType<Entity.SaleDetail>();
            _ViewSaleDetailEntity = EntityType.GetEntityType<Entity.ViewSaleDetail>();
        }

        [Log]
        public object Delete2()
        {
            Guid saleId = (Guid)this._QueryRequest.PrimaryKeyProperty.Value;
            new Bill().DeleteBill(saleId);

            return CommonOperation.DeleteByLogic<Sale>(this, null);
        }

        [Log]
        public object Insert2()
        {
            return EditSale(false);
        }

        object EditSale(bool blUpdate)
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("SaleDate", DateTime.Now);
            if (blUpdate)
            {
                entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
                entityData.SetDefaultValue("UpdateDate", DateTime.Now);
            }
            else entityData.SetDefaultValue("CreateUser", this._Request.OperationUser);
            int saleCode = GetSaleCode(entityData.GetValue<DateTime>("SaleDate"));
            if (string.IsNullOrEmpty(entityData.GetStringValue("SaleCode")))
            {
                entityData.SetDefaultValue("SaleCode", string.Format("S{0}", saleCode));
                entityData.SetDefaultValue("SaleIntCode", saleCode);
            }

            byte saleType = entityData.GetValue<byte>("SaleType");

            byte saleStatus = entityData.GetValue<byte>("SaleStatus");

            string name = string.Empty;
            Guid billTypeId = Guid.Empty;

            if (saleStatus == 1)
            {
                name = saleType == 1 ? "销售单" : saleType == 2 ? "销售单退货" : "";
                if (string.IsNullOrEmpty(name)) return this.GetMessageDict("未知销售类型！");

                billTypeId = new BillType().GetBillTypeId(name);
                if (billTypeId == Guid.Empty)
                {
                    return this.GetMessageDict("销售单账目类型不存在，请在账目类型中新增名为\"" + name + "\"的账目类型！");
                }
            }

            string remark = saleType == 1 ? string.Format("销售单{0}收款", entityData.GetStringValue("SaleCode")) : string.Format("销售单退货{0}付款", entityData.GetStringValue("SaleCode"));

            object obj = null;
            if (blUpdate) obj = EntityByComplexTypeOperation.Update<Sale>(this, _SaleDetailEntity, "Details");
            else obj = EntityByComplexTypeOperation.Insert<Sale>(this, _SaleDetailEntity, "Details");

            if (obj is Dictionary<string, object> && saleStatus == 1)
            {
                Guid saleId = Guid.Empty;

                if (blUpdate) saleId = (Guid)this._QueryRequest.PrimaryKeyProperty.Value;
                else saleId = (obj as Dictionary<string, object>).GetValue<Guid>("PrimaryKey");

                if ((!blUpdate && saleId != Guid.Empty) || (blUpdate && (obj as Dictionary<string, object>).ContainsKey("Succeed")))
                {
                    decimal realAmount = entityData.GetValue<decimal>("RealAmount");
                    if (realAmount > 0) new Bill().EditBill(saleId, 2, saleType, remark, Guid.Parse(this._Request.OperationUser), billTypeId, realAmount, entityData.GetValue<DateTime>("SaleDate"));
                }
            }

            return obj;
        }

        [Log]
        public object Update2()
        {
            return EditSale(true);
        }


        [Log]
        public object UpdateStatus()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            Guid saleId = (Guid)this._QueryRequest.PrimaryKeyProperty.Value;

            IEntityData oldEntityData = this.SelectEntityByPrimaryKey(saleId);
            if (oldEntityData == null) return GetMessageDict("销售单信息不存在，请刷新数据！");

            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);

            return this.Update();
        }

        int GetSaleCode(DateTime saleDate)
        {
            int ymd = int.Parse(saleDate.Date.ToString("yyMMdd"));
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("Max(SaleIntCode) SaleIntCode");
            query.Where(string.Format("where IsDelete=0 and SUBSTRING(SaleCode,2,6)='{0}'", ymd));

            IEntityData entityData = this.SelectEntity(query);

            int saleIntCode = entityData.GetValue<int>("SaleIntCode");

            if (saleIntCode < ymd) saleIntCode = ymd * 1000;

            return saleIntCode + 1;
        }

        public object GetSale()
        {
            return EntityByComplexTypeOperation.GetEntityData<Sale>(this, _ViewSaleDetailEntity, "Details") as IEntityData;
        }
    }

    public class ViewSale : EntityRequest
    {
        EntityType _ViewSaleDetailEntity { get; set; }

        public ViewSale()
        {
        }

        public ViewSale(Request request)
            : base(request)
        {
            _ViewSaleDetailEntity = EntityType.GetEntityType<Entity.ViewSaleDetail>();

            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryBillGroupByInfo(data, wherqSql, parameterList);
        }

        void QueryBillGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select(@"sum(case when SaleStatus=3 then 0 else ShouldAmount2 end) as TotalShouldAmount,
                           sum(case when SaleStatus=3 then 0 else RealAmount2 end) as TotalRealAmount,
                           sum(case when SaleStatus=3 then 0 else DueAmount end) as TotalDueAmount, 
                           sum(case when SaleStatus=3 then 0 else SaleAmount end) as TotalSaleAmount,
                           sum(case when SaleStatus=3 then 0 else BidAmount end) as TotalBidAmount,
                           sum(case when SaleStatus=3 then 0 else Profit end) as TotalProfit");
            query.Where(whereSql, paramterList);

            IEntityData entityData = this.SelectEntity(query);

            decimal totalShouldAmount = entityData.GetValue<decimal>("TotalShouldAmount");
            decimal totalRealAmount = entityData.GetValue<decimal>("TotalRealAmount");
            decimal totalBidAmount = entityData.GetValue<decimal>("TotalBidAmount");
            decimal totalSaleAmount = entityData.GetValue<decimal>("TotalSaleAmount");
            decimal totalProfit = entityData.GetValue<decimal>("TotalProfit");
            decimal totalDueAmount = entityData.GetValue<decimal>("TotalDueAmount");

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("TotalShouldAmount", totalShouldAmount.ToString("C"));
            groupByInfo.SetValue("TotalShouldAmountColor", totalShouldAmount >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalRealAmount", totalRealAmount.ToString("C"));
            groupByInfo.SetValue("TotalRealAmountColor", totalRealAmount >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalSaleAmount", totalSaleAmount.ToString("C"));
            groupByInfo.SetValue("TotalSaleAmountColor", totalSaleAmount >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalBidAmount", totalBidAmount.ToString("C"));
            groupByInfo.SetValue("TotalBidAmountColor", totalBidAmount >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalProfit", totalProfit.ToString("C"));
            groupByInfo.SetValue("TotalProfitColor", totalProfit >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalDueAmount", totalDueAmount.ToString("C"));
            groupByInfo.SetValue("TotalDueAmountColor", totalDueAmount >= 0 ? "#1890ff" : "red");

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public object Select2()
        {
            return this.Select();
        }

        public object GetSale()
        {
            return EntityByComplexTypeOperation.GetEntityData<ViewSale>(this, _ViewSaleDetailEntity, "Details") as IEntityData;
        }
    }
}
