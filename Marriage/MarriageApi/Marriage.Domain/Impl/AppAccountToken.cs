using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// App账号访问Token
    /// </summary>
    public class AppAccountToken : IAppAccountToken
    {
        public Data.IAppAccountToken _AppAccountToken { get; set; }

        /// <summary>
        /// 获取App账号访问Token
        /// </summary>
        /// <param name="appAccountId"></param>
        /// <returns></returns>
        public Entity.Domain.AppAccountToken GetAccessToken(Guid appAccountId)
        {
            IEntityData entityData = _AppAccountToken.GetEntityData(appAccountId);
            if (entityData == null) return null;

            Entity.Domain.AppAccountToken entity = Parse.IEntityDataTo<Entity.Domain.AppAccountToken>(entityData);

            if (entity.UpdateDate.AddSeconds(entity.ExpiresIn - 10) < DateTime.Now) entity.AccessToken = string.Empty;

            return entity;
        }

        /// <summary>
        /// 新增App账号访问Token
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        public bool Insert(Entity.Domain.AppAccountToken entity)
        {
            IEntityData entityData = new EntityData("AppAccountToken");

            entityData.SetValue("AccessToken", entity.AccessToken);
            entityData.SetValue("AppAccountId", entity.AppAccountId);
            entityData.SetValue("ExpiresIn", entity.ExpiresIn);
            entityData.SetValue("UpdateDate", DateTime.Now);

            return _AppAccountToken.Insert(entityData);
        }

        /// <summary>
        /// 更新App账号访问Token
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        public bool Update(Entity.Domain.AppAccountToken entity)
        {
            IEntityData entityData = new EntityData("AppAccountToken");

            entityData.SetValue("AccessToken", entity.AccessToken);
            entityData.SetValue("TokenId", entity.TokenId);
            entityData.SetValue("ExpiresIn", entity.ExpiresIn);
            entityData.SetValue("UpdateDate", DateTime.Now);

            return _AppAccountToken.Update(entityData);
        }
    }
}
