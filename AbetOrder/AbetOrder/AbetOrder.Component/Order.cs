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

namespace AbetOrder.Component
{
    public class Order : EntityRequest
    {
        EntityType _OrderDetailEntity { get; set; }
        EntityType _OrderImageEntity { get; set; }
        Dictionary<string, EntityType> _ComplexDictionary { get; set; }
        EntityType _TemplateHtmlEntity { get; set; }

        public Order()
        {
            EntityType = EntityType.GetEntityType<Entity.Order>();
            _TemplateHtmlEntity = EntityType.GetEntityType<Entity.TemplateHtml>();
        }

        public Order(Request request)
            : base(request)
        {
            _OrderDetailEntity = EntityType.GetEntityType<Entity.OrderDetail>();
            _OrderImageEntity = EntityType.GetEntityType<Entity.OrderImage>();
            _ComplexDictionary = new Dictionary<string, EntityType>();
            _ComplexDictionary.Add("Details", _OrderDetailEntity);
            _ComplexDictionary.Add("Images", _OrderImageEntity);

            _TemplateHtmlEntity = EntityType.GetEntityType<Entity.TemplateHtml>();
        }

        [Log]
        public object Delete2()
        {
            Guid orderId = (Guid)this._QueryRequest.PrimaryKeyProperty.Value;
            new Bill().DeleteOrderBill(orderId);
            new DealingsBill().DeleteOrderDealingsBill(orderId);

            return CommonOperation.DeleteByLogic<Order>(this, null);
        }

        [Log]
        public object Insert2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("OrderDate", DateTime.Now);
            entityData.SetDefaultValue("CreateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);
            int orderCode= GetOrderCode(entityData.GetValue<DateTime>("OrderDate"));
            if (string.IsNullOrEmpty(entityData.GetStringValue("OrderCode")))
            {
                entityData.SetDefaultValue("OrderCode", orderCode);
                entityData.SetDefaultValue("OrderIntCode", orderCode);
            }

            object obj = EntityByComplexTypeOperation.Insert<Order>(this, _ComplexDictionary);

            if (obj is Dictionary<string, object>)
            {
                Guid orderId = (obj as Dictionary<string, object>).GetValue<Guid>("PrimaryKey");
                if (orderId != Guid.Empty)
                {
                    GenOrderPdf(orderId, 1);
                    decimal paidDeposit = entityData.GetValue<decimal>("PaidDeposit");
                    if (paidDeposit > 0) new Bill().EditBill(orderId, entityData.GetStringValue("OrderCode"), Guid.Parse(this._Request.OperationUser), paidDeposit, entityData.GetValue<DateTime>("OrderDate"));
                }
            }

            return obj;
        }

        [Log]
        public object Update2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("OrderDate", DateTime.Now);
            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);
            int orderCode = GetOrderCode(entityData.GetValue<DateTime>("OrderDate"));
            if (string.IsNullOrEmpty(entityData.GetStringValue("OrderCode")))
            {
                entityData.SetDefaultValue("OrderCode", orderCode);
                entityData.SetDefaultValue("OrderIntCode", orderCode);
            }

            Guid orderId = (Guid)this._QueryRequest.PrimaryKeyProperty.Value;

            object obj= EntityByComplexTypeOperation.Update<Order>(this, _ComplexDictionary);

            if (obj is Dictionary<string, object>)
            {
                if ((obj as Dictionary<string, object>).ContainsKey("Succeed"))
                {
                    GenOrderPdf(orderId, 1);
                    decimal paidDeposit = entityData.GetValue<decimal>("PaidDeposit");
                    new Bill().EditBill(orderId, entityData.GetStringValue("OrderCode"), Guid.Parse(this._Request.OperationUser), paidDeposit, entityData.GetValue<DateTime>("OrderDate"));
                }
            }

            return obj;
        }

        [Log]
        public object Update3()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData.SetDefaultValue("UpdateUser", this._Request.OperationUser);
            entityData.SetDefaultValue("UpdateDate", DateTime.Now);
            entityData.SetDefaultValue("BillDate", DateTime.Now);
            entityData.SetValue("OrderDate", entityData.GetValue("BillDate"));

            decimal costAmount = entityData.GetValue<decimal>("CostAmount");
            decimal paidDeposit = entityData.GetValue<decimal>("PaidDeposit");

            Guid orderId = (Guid)this._QueryRequest.PrimaryKeyProperty.Value;
            IEntityData oldEntityData = this.SelectEntityByPrimaryKey(orderId);
            if (oldEntityData != null)
            {
                decimal actualAmount = oldEntityData.GetValue<decimal>("ActualAmount");
                decimal processAmount = oldEntityData.GetValue<decimal>("ProcessAmount");

                entityData.SetValue("ShouldPayBalance", actualAmount - paidDeposit);
                entityData.SetValue("Profit", actualAmount - costAmount - processAmount);

                new Bill().EditBill(orderId, oldEntityData.GetStringValue("OrderCode"), Guid.Parse(this._Request.OperationUser), paidDeposit, entityData.GetValue<DateTime>("BillDate"));
            }

            int orderCode = GetOrderCode(entityData.GetValue<DateTime>("OrderDate"));
            if (string.IsNullOrEmpty(entityData.GetStringValue("OrderCode")))
            {
                entityData.SetDefaultValue("OrderCode", orderCode);
                entityData.SetDefaultValue("OrderIntCode", orderCode);
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
            else if (orderStatus == 1) GenOrderPdf(orderId, 2);
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

        void GenOrderPdf(Guid orderId, int type)
        {
            Task.Run(() => GenPdf(orderId, type));
        }

        public void GenPdf(Guid orderId, int type)
        {
            try
            {
                IEntityData order = this.SelectEntityByPrimaryKey(orderId);
                object templateHtmlId = type == 1 ? order.GetValue("OrderTemplateHtmlId") : order.GetValue("ProcessTemplateHtmlId");
                if (templateHtmlId == null) throw new Exception(string.Format("未选择{0}模板！", type == 1 ? "订单" : "加工单"));

                order.SetValue("TemplateHtmlId", templateHtmlId);
                IEntityData template = GetTemplateHtml((Guid)templateHtmlId);
                if (templateHtmlId == null) throw new Exception("模板不存在！");

                string html = template.GetStringValue("Html");
                string css = template.GetStringValue("Css");

                html = new TemplateResolve().ResolveContent(html, order);

                string fileName = "PdfFiles\\" + (type == 1 ? "Order" : "Process");

                string path = this._Request.RootPath + "\\" + fileName;
                if (!Directory.Exists(path)) Directory.CreateDirectory(path);

                fileName += "\\" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + new Random().Next(100000, 999999) + ".pdf";
                path = this._Request.RootPath + "\\" + fileName;


                OpenDataAccess.Utility.PdfDocument.CreatePdfFromHtml(html, css, path);

                IEntityData entityData = new EntityData(this.EntityType);
                entityData.SetValue("OrderId", orderId);
                entityData.SetValue(type == 1 ? "OrderPdfPath" : "ProcessTemplateHtmlId", fileName.Replace("\\", "/"));

                this.UpdateEntityByPrimaryKey(orderId, entityData);
            }
            catch
            {

            }
        }

        IEntityData GetTemplateHtml(Guid templateHtmlId)
        {
            IQuery query = new Query(_TemplateHtmlEntity.TableName);
            query.Where(string.Format("where Id='{0}'", templateHtmlId));
            return this.SelectEntity(query);
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
    }

    public class ViewOrder : EntityRequest
    {
        EntityType _OrderDetailEntity { get; set; }
        EntityType _OrderImageEntity { get; set; }
        Dictionary<string, EntityType> _ComplexDictionary { get; set; }

        public ViewOrder()
        {
        }

        public ViewOrder(Request request)
            : base(request)
        {
            _OrderDetailEntity = EntityType.GetEntityType<Entity.OrderDetail>();
            _OrderImageEntity = EntityType.GetEntityType<Entity.OrderImage>();
            _ComplexDictionary = new Dictionary<string, EntityType>();
            _ComplexDictionary.Add("Details", _OrderDetailEntity);
            _ComplexDictionary.Add("Images", _OrderImageEntity);

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

        public object GetOrder()
        {
            IEntityData entityData = EntityByComplexTypeOperation.GetEntityData<ViewOrder>(this, _ComplexDictionary) as IEntityData;

            if (entityData != null)
            {
                entityData.SetValue("BillStatus", new DealingsBill().GetBillStatus(entityData.GetValue<Guid>("OrderId")));
            }

            entityData.EntityName = "Order";

            return entityData;
        }
    }
}
