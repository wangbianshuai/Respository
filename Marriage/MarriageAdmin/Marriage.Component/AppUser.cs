using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Marriage.Component
{
    public class AppUser : EntityRequest
    {
        public AppUser()
        {
        }

        public AppUser(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<AppUser>(this);
        }

        [Log]
        public object ChangePassword()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            Guid adminUserId = Guid.Parse(_Request.OperationUser);
            IEntityData user = this.GetUserByIdPassword(adminUserId, entityData.GetStringValue("OldPassword"));
            if (user == null) return GetMessageDict("原密码不正确！");

            IEntityData updateEntityData = new EntityData(this.EntityType);
            updateEntityData.SetValue("LoginPassword", entityData.GetStringValue("NewPassword"));
            return GetBoolDict(this.UpdateEntityByPrimaryKey(adminUserId, updateEntityData));
        }

        IEntityData GetUserByIdPassword(Guid adminUserId, string loginPassword)
        {
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.CurrentDataBase.InParameter("@UserId", adminUserId));
            parameterList.Add(this.CurrentDataBase.InParameter("@LoginPassword", loginPassword));

            IQuery query = new Query(this.EntityType.TableName, this.EntityType.Name);
            query.Where("where UserId=@UserId and LoginPassword=@LoginPassword", parameterList);

            return this.SelectEntity(query);
        }

        [Log]
        public object Login()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData = GetUser(entityData.GetStringValue("LoginName"), entityData.GetStringValue("LoginPassword"));

            if (entityData == null) return GetMessageDict("登录名或密码不正确！");

            Task.Run(() => UpdateLoginDate(entityData));

            _Request.OperationUser = entityData.GetValue<Guid>("UserId").ToString();

            return entityData;
        }

        void UpdateLoginDate(IEntityData entityData)
        {
            try
            {
                IEntityData updateEntityData = new EntityData(this.EntityType);
                updateEntityData.SetValue("LastLoginDate", DateTime.Now);
                this.UpdateEntityByPrimaryKey(entityData.GetValue("UserId"), updateEntityData);
            }
            catch
            {
            }
        }

        IEntityData GetUser(string loginName, string loginPassword)
        {
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@LoginName", loginName));
            parameterList.Add(this.InParameter("@LoginPassword", loginPassword));

            IQuery query = new Query(this.EntityType.TableName, this.EntityType.Name);
            query.Select("LoginName,Name,UserId,LastLoginDate");
            query.Where("where IsDelete=0 and LoginName=@LoginName and LoginPassword=@LoginPassword", parameterList);

            return this.SelectEntity(query);
        }
    }
}
