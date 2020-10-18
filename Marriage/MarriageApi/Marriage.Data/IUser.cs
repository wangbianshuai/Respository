using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data
{
    public interface IUser
    {
        /// <summary>
        /// 获取最近更新时间
        /// </summary>
        /// <returns></returns>
        DateTime GetLastUpdateDate();

        /// <summary>
        /// 删除当前App账号下用户
        /// </summary>
        /// <param name="appAccountId"></param>
        /// <returns></returns>
        bool DeleteByAppAccountId(Guid appAccountId);

        /// <summary>
        /// 批量插入记录
        /// </summary>
        /// <param name="entityDataList"></param>
        void BullInsert(List<IEntityData> entityDataList);
    }
}
