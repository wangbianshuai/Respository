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
    public class ViewPurchaseDetail : EntityRequest
    {
        public ViewPurchaseDetail()
        {
        }

        public ViewPurchaseDetail(Request request)
            : base(request)
        {
            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryBillGroupByInfo(data, wherqSql, parameterList);
        }

        void QueryBillGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select(@"sum(case when PurchaseStatus=3 then 0 else Amount2 end) as TotalAmount2,
                           sum(case when PurchaseStatus=3 then 0 else Discount2 end) as TotalDiscount2");

            query.Where(whereSql, paramterList);

            IEntityData entityData = this.SelectEntity(query);

            decimal totalAmount2 = entityData.GetValue<decimal>("TotalAmount2");
            decimal totalDiscount2 = entityData.GetValue<decimal>("TotalDiscount2");

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("TotalAmount2", totalAmount2.ToString("C"));
            groupByInfo.SetValue("TotalAmount2Color", totalAmount2 >= 0 ? "#1890ff" : "red");
            groupByInfo.SetValue("TotalDiscount2", totalDiscount2.ToString("C"));
            groupByInfo.SetValue("TotalDiscount2Color", totalDiscount2 >= 0 ? "#1890ff" : "red");

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public object Select2()
        {
            return this.Select();
        }
    }
}
