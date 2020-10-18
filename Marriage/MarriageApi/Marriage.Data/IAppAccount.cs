using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    public interface IAppAccount
    {
        /// <summary>
        /// 以主键获取App账号
        /// </summary>
        /// <param name="appAccountId"></param>
        /// <returns></returns>
        IEntityData GetAppAccountById(Guid appAccountId);
    }
}
