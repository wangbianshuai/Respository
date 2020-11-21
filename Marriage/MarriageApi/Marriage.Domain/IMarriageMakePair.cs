using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
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
        List<Entity.Domain.MarriageMakePair2> GetMarriageMakePairUsers();

        /// <summary>
        /// 批量新增
        /// </summary>
        /// <param name="marriageMakePairList"></param>
        /// <param name="marriageMakePairDetailList"></param>
        void BulkCopyInsert(List<Dictionary<string, object>> marriageMakePairList, List<Dictionary<string, object>> marriageMakePairDetailList);
    }
}
