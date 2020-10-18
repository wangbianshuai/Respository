using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Component
{
    public class AppAccount : EntityRequest
    {
        public AppAccount()
        {
            this.EntityType = EntityType.GetEntityType<Entity.AppAccount>();
        }

        public AppAccount(Request request)
            : base(request)
        {
        }

        public Entity.AppAcountInfo GetAppAccountId(string accessPathName)
        {
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@AccessPathName", accessPathName));

            IQuery query = new Query(this.EntityType.TableName, this.EntityType.Name);
            query.Select("AppAccountId,SiteTitle");
            query.Where("where IsDelete=0 and Status=1 and AccessPathName=@AccessPathName", parameterList);

            IEntityData entityData = this.SelectEntity(query);
            if (entityData == null) return null;


            return new Entity.AppAcountInfo()
            {
                AppAccountId = entityData.GetValue<Guid>("AppAccountId"),
                SiteTitle = entityData.GetStringValue("SiteTitle")
            };
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<AppAccount>(this);
        }
    }
}
