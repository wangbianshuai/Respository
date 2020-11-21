using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 相亲匹配
    /// </summary>
    public interface IMarriageMakePair
    {
        /// <summary>
        /// 获取相亲匹配用户列表
        /// </summary>
        /// <returns></returns>
        List<IEntityData> GetMarriageMakePairUsers();

        /// <summary>
        /// 删除相亲匹配
        /// </summary>
        /// <returns></returns>
        bool DeleteMarriageMakePair();

        /// <summary>
        /// 批量插入
        /// </summary>
        /// <param name="dictList"></param>
        /// <returns></returns>
        void BulkCopyInsert(List<Dictionary<string, object>> dictList);
    }
}
