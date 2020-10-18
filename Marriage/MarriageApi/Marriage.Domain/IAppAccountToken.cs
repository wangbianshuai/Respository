using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// App账号访问Token
    /// </summary>
    public interface IAppAccountToken
    {
        /// <summary>
        /// 获取App账号访问Token
        /// </summary>
        /// <param name="appAccountId"></param>
        /// <returns></returns>
        Entity.Domain.AppAccountToken GetAccessToken(Guid appAccountId);

        /// <summary>
        /// 新增App账号访问Token
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        bool Insert(Entity.Domain.AppAccountToken entity);

        /// <summary>
        /// 更新App账号访问Token
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        bool Update(Entity.Domain.AppAccountToken entity);
    }
}
