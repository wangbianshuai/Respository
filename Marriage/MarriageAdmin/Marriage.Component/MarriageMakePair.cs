using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Component
{
    public class MarriageMakePair : EntityRequest
    {
        public MarriageMakePair()
        {
        }

        public MarriageMakePair(Request request)
            : base(request)
        {
        }

        public object GetMarriageMakePairsDetails()
        {
            IQuery query = new Query("v_MarriageMakePairDetail");

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@MakePairId", this._QueryRequest.PrimaryKeyProperty.Value));

            query.Where("where MakePairId=@MakePairId", parameterList);
            query.OrderBy("order by PercentValue desc");

            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("Details", this.SelectEntities(query));
            return dict;
        }
    }
}
