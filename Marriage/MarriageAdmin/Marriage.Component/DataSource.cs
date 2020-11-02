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
    public class DataSource : EntityRequest
    {
        EntityType _DataSourcePropertyEntity { get; set; }

        public DataSource()
        {
        }

        public DataSource(Request request)
            : base(request)
        {
            _DataSourcePropertyEntity = EntityType.GetEntityType<Entity.DataSourceItem>();
        }

        [Log]
        public object Insert2()
        {
            return EntityByComplexTypeOperation.Insert<DataSource>(this, _DataSourcePropertyEntity, "Properties");
        }

        [Log]
        public object Update2()
        {
            return EntityByComplexTypeOperation.Update<DataSource>(this, _DataSourcePropertyEntity, "Properties");
        }

        public object GetEntityData()
        {
            return EntityByComplexTypeOperation.GetEntityData<DataSource>(this, _DataSourcePropertyEntity, "Properties") as IEntityData;
        }

        [Log]
        public object Delete2()
        {
            List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.ConditionItem>(),"该数据源被条件类型中引用，请先删除相应的条件类型中的选项！", "DataSourceId"),
            };
            return CommonOperation.DeleteByLogic<DataSource>(this, relationList);
        }
    }
}
