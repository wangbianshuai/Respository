using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenDataAccess.Data;
using System.Data;

namespace WorkReport.Component
{
    public class PullRequest : EntityRequest
    {
        public PullRequest()
        {
        }

        public PullRequest(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<PullRequest>(this, null);
        }
    }

    public class ViewPullRequest : EntityRequest
    {
        public ViewPullRequest()
        {
        }

        public ViewPullRequest(Request request)
            : base(request)
        {
            this.QueryGroupByInfo = (data, wherqSql, parameterList) => this.QueryBillGroupByInfo(data, wherqSql, parameterList);
        }

        void QueryBillGroupByInfo(IEntityData data, string whereSql, List<IDbDataParameter> paramterList)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("sum(TestCases) as TotalTestCases,sum(Comments) as TotalComments");
            query.Where(whereSql, paramterList);

            data.SetValue("GroupByInfo", this.SelectEntity(query));
        }

        public object Select2()
        {
            return this.Select();
        }
    }
}
