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
    public class AdminUser : EntityRequest
    {
        EntityType _DictionaryConfigEntity { get; set; }
        public AdminUser()
        {
        }

        public AdminUser(Request request)
            : base(request)
        {
            _DictionaryConfigEntity = EntityType.GetEntityType<Entity.DictionaryConfig>();
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<AdminUser>(this);
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

        /// <summary>
        /// 获取接收消息API地址
        /// </summary>
        /// <returns></returns>
        IEntityData GetReceiveMessasgeApiUrl()
        {
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@Name", "ReceiveMessasgeApiUrl"));

            IQuery query = new Query(_DictionaryConfigEntity.TableName);
            query.Where("where IsDelete=0 and Name=@Name", parameterList);

            return this.SelectEntity(query);
        }

        IEntityData GetUserByIdPassword(Guid adminUserId, string loginPassword)
        {
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.CurrentDataBase.InParameter("@AdminUserId", adminUserId));
            parameterList.Add(this.CurrentDataBase.InParameter("@LoginPassword", loginPassword));

            IQuery query = new Query(this.EntityType.TableName, this.EntityType.Name);
            query.Where("where AdminUserId=@AdminUserId and LoginPassword=@LoginPassword", parameterList);

            return this.SelectEntity(query);
        }

        [Log]
        public object Login()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            entityData = GetUser(entityData.GetStringValue("LoginName"), entityData.GetStringValue("LoginPassword"), this._Request.AppAccountId);

            if (entityData == null) return GetMessageDict("登录名或密码不正确！");

            Task.Run(() => UpdateLoginDate(entityData));

            _Request.OperationUser = entityData.GetValue<Guid>("AdminUserId").ToString();

            //获取接收消息API地址
            IEntityData receiveMessage = GetReceiveMessasgeApiUrl();
            if (receiveMessage != null) entityData.SetValue("ReceiveMessageApiUrl", receiveMessage.GetStringValue("Value"));

            return entityData;
        }

        void UpdateLoginDate(IEntityData entityData)
        {
            try
            {
                IEntityData updateEntityData = new EntityData(this.EntityType);
                updateEntityData.SetValue("LastLoginDate", DateTime.Now);
                this.UpdateEntityByPrimaryKey(entityData.GetValue("AdminUserId"), updateEntityData);
            }
            catch
            {
            }
        }

        IEntityData GetUser(string loginName, string loginPassword, Guid appAccountId)
        {
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@LoginName", loginName));
            parameterList.Add(this.InParameter("@LoginPassword", loginPassword));
            parameterList.Add(this.InParameter("@AppAccountId", appAccountId));

            IQuery query = new Query(this.EntityType.TableName, this.EntityType.Name);
            query.Select("LoginName,UserName,AdminUserId,LastLoginDate,AppAccountId");
            query.Where("where AppAccountId=@AppAccountId and LoginName=@LoginName and LoginPassword=@LoginPassword", parameterList);

            return this.SelectEntity(query);
        }
    }
}
