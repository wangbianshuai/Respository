using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    public interface IAppAccountToken
    {

        /// <summary>
        /// 获取App账号访问Token
        /// </summary>
        /// <param name="appAccountId"></param>
        /// <returns></returns>
        IEntityData GetEntityData(Guid appAccountId);

        /// <summary>
        /// 新增App账号访问Token
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        bool Insert(IEntityData entityData);

        /// <summary>
        /// 更新App账号访问Token
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        bool Update(IEntityData entityData);
    }
}
