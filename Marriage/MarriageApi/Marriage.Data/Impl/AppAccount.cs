using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data.Impl
{
    public class AppAccount : EntityAccess, IAppAccount
    {
        public AppAccount()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.AppAccount>();
        }

        /// <summary>
        /// 以主键获取App账号
        /// </summary>
        /// <param name="appAccountId"></param>
        /// <returns></returns>
        public IEntityData GetAppAccountById(Guid appAccountId)
        {
            return this.SelectEntityByPrimaryKey(appAccountId);
        }
    }
}
