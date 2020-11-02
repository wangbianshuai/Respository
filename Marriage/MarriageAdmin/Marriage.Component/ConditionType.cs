using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace Marriage.Component
{
    public class ConditionType : EntityRequest
    {
        EntityType _ConditionTypePropertyEntity { get; set; }

        public ConditionType()
        {
        }

        public ConditionType(Request request)
            : base(request)
        {
            _ConditionTypePropertyEntity = EntityType.GetEntityType<Entity.ConditionItem>();
        }

        [Log]
        public object Insert2()
        {
            SetDisplayIndex();
            return EntityByComplexTypeOperation.Insert<ConditionType>(this, _ConditionTypePropertyEntity, "Properties");
        }

        [Log]
        public object Update2()
        {
            SetDisplayIndex();
            return EntityByComplexTypeOperation.Update<ConditionType>(this, _ConditionTypePropertyEntity, "Properties");
        }

        void SetDisplayIndex()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();
            var list = entityData.GetValue<List<Dictionary<string, object>>>("Properties");
            for (var i = 0; i < list.Count; i++)
            {
                int displayIndex = list[i].GetValue<int>("DisplayIndex");
                if (displayIndex == 0) list[i]["DisplayIndex"] = i + 1;
            }
        }

        public object GetEntityData()
        {
            IEntityData entityData= EntityByComplexTypeOperation.GetEntityData<ConditionType>(this, _ConditionTypePropertyEntity, "Properties") as IEntityData;

            if (entityData != null)
            {
                var list = entityData.GetValue<List<IEntityData>>("Properties").OrderBy(b => b.GetValue<int>("DisplayIndex"));
                entityData.SetValue("Properties", list.ToList());
            }
            return entityData;
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<ConditionType>(this);
        }
    }
}
