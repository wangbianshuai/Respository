using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 相亲匹配
    /// </summary>
    public interface IMarriageMakePairDetail
    {
        /// <summary>
        /// 删除相亲匹配明细 
        /// </summary>
        /// <returns></returns>
        bool DeleteMarriageMakePairDetail();

        /// <summary>
        /// 批量插入
        /// </summary>
        /// <param name="dictList"></param>
        /// <returns></returns>
        void BulkCopyInsert(List<Dictionary<string, object>> dictList);
    }
}
