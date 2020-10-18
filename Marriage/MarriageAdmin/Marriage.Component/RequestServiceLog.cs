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
    public class RequestServiceLog : EntityRequest
    {
        EntityType _ViewRequstServiceLog { get; set; }
        public RequestServiceLog()
        {
        }

        public RequestServiceLog(Request request)
            : base(request)
        {
            _ViewRequstServiceLog = EntityType.GetEntityType<Entity.ViewRequestServiceLog>();
        }


        public object GetEntityData()
        {
            object requestServiceLogId = this._QueryRequest.PrimaryKeyProperty.Value;
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.CurrentDataBase.InParameter("@Id", requestServiceLogId));

            IQuery query = new Query(this._ViewRequstServiceLog.TableName);
            query.Where("where Id=@Id", parameterList);

            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add(this.EntityType.Name, this.SelectEntity(query));
            return dict;
        }

        [Log]
        public object ReSend()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();
            List<Guid> logIdList = entityData.GetValue<List<Guid>>("LogIds");
            return null;
        }
    }
}
