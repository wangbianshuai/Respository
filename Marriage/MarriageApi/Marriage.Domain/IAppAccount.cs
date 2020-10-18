using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// App账号
    /// </summary>
    public interface IAppAccount
    {
        /// <summary>
        /// 以主键获取App账号
        /// </summary>
        /// <param name="appAccountId"></param>
        /// <returns></returns>
        Entity.Domain.AppAccount GetAppAccountById(Guid appAccountId);
    }
}
