using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// App账号
    /// </summary>
    public class AppAccount: IAppAccount
    {
        public Data.IAppAccount _AppAccount { get; set; }

        /// <summary>
        /// 以主键获取App账号
        /// </summary>
        /// <param name="appAccountId"></param>
        /// <returns></returns>
        public Entity.Domain.AppAccount GetAppAccountById(Guid appAccountId)
        {
            return Parse.IEntityDataTo<Entity.Domain.AppAccount>(_AppAccount.GetAppAccountById(appAccountId));
        }
    }
}
