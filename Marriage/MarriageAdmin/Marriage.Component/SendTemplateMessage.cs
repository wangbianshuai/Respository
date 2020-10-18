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
    public class SendTemplateMessage : EntityRequest
    {
        EntityType _SendTemplateMessagePropertyEntity { get; set; }

        public SendTemplateMessage()
        {
        }

        public SendTemplateMessage(Request request)
            : base(request)
        {
            _SendTemplateMessagePropertyEntity = EntityType.GetEntityType<Entity.SendTemplateMessageProperty>();
        }

        [Log]
        public object Insert2()
        {
            return EntityByComplexTypeOperation.Insert<SendTemplateMessage>(this, _SendTemplateMessagePropertyEntity, "Properties");
        }

        [Log]
        public object Update2()
        {
            return EntityByComplexTypeOperation.Update<SendTemplateMessage>(this, _SendTemplateMessagePropertyEntity, "Properties");
        }

        public object GetEntityData()
        {
            return EntityByComplexTypeOperation.GetEntityData<SendTemplateMessage>(this, _SendTemplateMessagePropertyEntity, "Properties") as IEntityData;
        }

        [Log]
        public object SaveToSend()
        {
            object obj = null;
            if (this._QueryRequest.PrimaryKeyProperty != null) obj = this.Update2();
            else obj = Insert2();

            return obj;
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<SendTemplateMessage>(this);
        }
    }
}
