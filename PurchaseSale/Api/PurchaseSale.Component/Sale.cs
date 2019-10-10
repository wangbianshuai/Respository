﻿using OpenDataAccess.Data;
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

        public Sale()
        {
        }

        public Sale(Request request)
            : base(request)
        {
            _SaleDetailEntity = EntityType.GetEntityType<Entity.SaleDetail>();
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
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("SaleDate", DateTime.Now);
            entityData.SetDefaultValue("CreateUser", this._Request.OperationUser);
            int orderCode = GetSaleCode(entityData.GetValue<DateTime>("SaleDate"));
            if (string.IsNullOrEmpty(entityData.GetStringValue("SaleCode")))
            {
                entityData.SetDefaultValue("SaleCode", string.Format("S{0}", orderCode));
                entityData.SetDefaultValue("SaleIntCode", orderCode);
            }

            byte saleType = entityData.GetValue<byte>("SaleType");
            
            string name = saleType == 1 ? "销售单" : saleType == 2 ? "销售单退货" : "";
            if (string.IsNullOrEmpty(name)) return this.GetMessageDict("未知销售类型！");

            Guid billTypeId = new BillType().GetBillTypeId(name);
            if (billTypeId == Guid.Empty)
            {
                return this.GetMessageDict("销售单账目类型不存在，请在账目类型中新增名为\"" + name + "\"的账目类型！");
            }

            string remark = saleType == 1 ? string.Format("销售单{0}收款", entityData.GetStringValue("SaleCode")) : string.Format("销售单退货{0}付款", entityData.GetStringValue("SaleCode"));

            object obj = EntityByComplexTypeOperation.Insert<Sale>(this, _SaleDetailEntity, "Details");

            if (obj is Dictionary<string, object>)
            {
                Guid saleId = (obj as Dictionary<string, object>).GetValue<Guid>("PrimaryKey");
                if (saleId != Guid.Empty)
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
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("SaleDate", DateTime.Now);
            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);
            int orderCode = GetSaleCode(entityData.GetValue<DateTime>("SaleDate"));
            if (string.IsNullOrEmpty(entityData.GetStringValue("SaleCode")))
            {
                entityData.SetDefaultValue("SaleCode", string.Format("S{0}", orderCode));
                entityData.SetDefaultValue("SaleIntCode", orderCode);
            }

            Guid saleId = (Guid)this._QueryRequest.PrimaryKeyProperty.Value;

            byte saleType = entityData.GetValue<byte>("SaleType");

            string name = saleType == 1 ? "销售单" : saleType == 2 ? "销售单退货" : "";
            if (string.IsNullOrEmpty(name)) return this.GetMessageDict("未知销售类型！");

            Guid billTypeId = new BillType().GetBillTypeId(name);
            if (billTypeId == Guid.Empty)
            {
                return this.GetMessageDict("销售单账目类型不存在，请在账目类型中新增名为\"" + name + "\"的账目类型！");
            }

            string remark = saleType == 1 ? string.Format("销售单{0}收款", entityData.GetStringValue("SaleCode")) : string.Format("销售单退货{0}付款", entityData.GetStringValue("SaleCode"));

            object obj = EntityByComplexTypeOperation.Update<Sale>(this, _SaleDetailEntity, "Details");

            if (obj is Dictionary<string, object>)
            {
                if ((obj as Dictionary<string, object>).ContainsKey("Succeed"))
                {
                    decimal realAmount = entityData.GetValue<decimal>("RealAmount");
                    if (realAmount > 0) new Bill().EditBill(saleId, 2, saleType, remark, Guid.Parse(this._Request.OperationUser), billTypeId, realAmount, entityData.GetValue<DateTime>("SaleDate"));
                }
            }

            return obj;
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

        int GetSaleCode(DateTime orderDate)
        {
            int ymd = int.Parse(orderDate.Date.ToString("yyMMdd"));
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("Max(SaleIntCode) SaleIntCode");
            query.Where(string.Format("where IsDelete=0 and SUBSTRING(SaleCode,1,6)='{0}'", ymd));

            IEntityData entityData = this.SelectEntity(query);

            int orderIntCode = entityData.GetValue<int>("SaleIntCode");

            if (orderIntCode < ymd) orderIntCode = ymd * 1000;

            return orderIntCode + 1;
        }
    }

    public class ViewSale : EntityRequest
    {
        EntityType _SaleDetailEntity { get; set; }

        public ViewSale()
        {
        }

        public ViewSale(Request request)
            : base(request)
        {
            _SaleDetailEntity = EntityType.GetEntityType<Entity.SaleDetail>();

            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryBillGroupByInfo(data, wherqSql, parameterList);
        }

        void QueryBillGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("sum(ShouldAmount) as TotalShouldAmount,sum(RealAmount) as TotalRealAmount,sum(BidAmount) as TotalBidAmount,sum(Profit) as TotalProfit");
            query.Where(whereSql, paramterList);

            IEntityData entityData = this.SelectEntity(query);

            decimal totalShouldAmount = entityData.GetValue<decimal>("TotalShouldAmount");
            decimal totalRealAmount = entityData.GetValue<decimal>("TotalRealAmount");
            decimal totalBidAmount = entityData.GetValue<decimal>("TotalBidAmount");
            decimal totalProfit = entityData.GetValue<decimal>("TotalProfit");

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("TotalShouldAmount", totalShouldAmount.ToString("C"));
            groupByInfo.SetValue("TotalShouldAmountColor", totalProfit >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalRealAmount", totalRealAmount.ToString("C"));
            groupByInfo.SetValue("TotalRealAmountColor", totalProfit >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalBidAmount", totalBidAmount.ToString("C"));
            groupByInfo.SetValue("TotalBidAmountColor", totalProfit >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalProfit", totalProfit.ToString("C"));
            groupByInfo.SetValue("TotalProfitColor", totalProfit >= 0 ? "#1890ff" : "red");

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public object Select2()
        {
            return this.Select();
        }

        public object GetSale()
        {
            IEntityData entityData = EntityByComplexTypeOperation.GetEntityData<ViewSale>(this,_SaleDetailEntity,"Details") as IEntityData;
  
            entityData.EntityName = "Sale";

            return entityData;
        }
    }
}
