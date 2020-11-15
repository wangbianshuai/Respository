using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace Marriage.Component
{
    public class ViewMatchmakerFeeDetail : EntityRequest
    {
        public ViewMatchmakerFeeDetail()
        {
        }

        public ViewMatchmakerFeeDetail(Request request)
            : base(request)
        {
            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryAmountGroupByInfo(data, wherqSql, parameterList);
        }

        void QueryAmountGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("sum(Amount) as Amount,sum(AppAmount) as AppAmount,sum(case when IsAppMatchmaker=1 then Amount else 0 end) AppMatchmakerAmount");
            query.Where(whereSql, paramterList);

            IEntityData entityData = this.SelectEntity(query);

            decimal amount = entityData.GetValue<decimal>("Amount");
            decimal appAmount = entityData.GetValue<decimal>("AppAmount");
            decimal appMatchmakerAmount = entityData.GetValue<decimal>("AppMatchmakerAmount");

            IEntityData groupByInfo = new EntityData(string.Empty);
            groupByInfo.SetValue("TotalAmount", amount.ToString("C"));
            groupByInfo.SetValue("TotalAppMatchmakerAmount", appAmount.ToString("C"));
            groupByInfo.SetValue("TotalAppAmount", appMatchmakerAmount.ToString("C"));

            data.SetValue("GroupByInfo", groupByInfo);
        }

        public object Select2()
        {
            return this.Select();
        }
    }
}
