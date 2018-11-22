using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class OrderPdf : EntityRequest
    {
        public OrderPdf()
        {
        }

        public OrderPdf(Request request)
            : base(request)
        {
        }

        [Log]
        public object ReGenPdf()
        {
            IEntityData entityData = this.SelectEntityByPrimaryKey(this._QueryRequest.PrimaryKeyProperty.Value);
            if (entityData == null) GetMessageDict("订单PDF信息不存在，请刷新数据！");

            Guid userId = Guid.Parse(this._Request.OperationUser);
            Guid orderId = entityData.GetValue<Guid>("OrderId");
            int type = entityData.GetValue<int>("PdfType");

            return GetBoolDict(true);
        }
    }
}
