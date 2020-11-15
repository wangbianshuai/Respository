using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Component
{
    public class MarriageUser : EntityRequest
    {
        public MarriageUser()
        {
        }

        public MarriageUser(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<MarriageUser>(this);
        }

        /// <summary>
        /// 更新状态
        /// </summary>
        /// <returns></returns>
        [Log]
        public object UpdateStatus()
        {
            return this.Update();
        }

        public object GetMarriageUsers()
        {
            int sex = int.Parse(this._QueryRequest.GetParameterValue("Sex"));
            IQuery query = new Query("v_MarriageUser2");

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@Sex", sex));

            query.Where("where Sex=@Sex", parameterList);
            query.OrderBy("order by UpdateStatusDate desc");

            return this.SelectEntities(query);
        }
    }
}
