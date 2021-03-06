﻿using OpenDataAccess.Data;
using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class Factory : EntityRequest
    {
        public Factory()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Factory>();
        }

        public Factory(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.Order>(),"此工厂存在被引用，不能删除，请先取消订单中引用！", "FactoryId")
            };
            return CommonOperation.DeleteByLogic<Factory>(this, relationList);
        }
    }
}
