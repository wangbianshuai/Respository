using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace AbetAccount.Admin.Component
{
    public class AccountType : EntityRequest
    {
        EntityType _AdminUserEntity { get; set; }

        public AccountType()
        {
        }

        public AccountType(Request request)
            : base(request)
        {
            _AdminUserEntity = EntityType.GetEntityType<Entity.AdminUser>();
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<AccountType>(this);
        }

        string GetAccountTypeIds()
        {
            IQuery query = new Query(this._AdminUserEntity.TableName);
            query.Select("AccountTypes");

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@UserId", this._Request.OperationUser));

            query.Where("where IsDelete=0 and UserId=@UserId", parameterList);

            var entityData = this.SelectEntity(query);

            if (entityData == null) return string.Empty;

            string ids = entityData.GetStringValue("AccountTypes");
            if (string.IsNullOrEmpty(ids)) return string.Empty;

            return string.Join(",", ids.Split(",").ToList().Select(s => "'" + s + "'"));
        }


        public object GetUserAccountTypes()
        {
            string ids = GetAccountTypeIds();
            if (string.IsNullOrEmpty(ids)) return new List<IEntityData>();

            IQuery query = new Query(this.EntityType.TableName);
            query.Select("TypeId,Name,IsHaveCustomer");


            query.Where(string.Format("where IsDelete=0 and TypeId in ({0})", ids));

            return this.SelectEntities(query);
        }
    }
}
