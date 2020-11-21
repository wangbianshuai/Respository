using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 相亲匹配
    /// </summary>
    public class MarriageMakePair : IMarriageMakePair
    {
        public Data.IMarriageMakePair _MarriageMakePair { get; set; }

        public Data.IMarriageMakePairDetail _MarriageMakePairDetail { get; set; }

        /// <summary>
        /// 获取相亲匹配用户列表
        /// </summary>
        /// <returns></returns>
        public List<Entity.Domain.MarriageMakePair2> GetMarriageMakePairUsers()
        {
            return Parse.IEntityDataListTo<Entity.Domain.MarriageMakePair2>(_MarriageMakePair.GetMarriageMakePairUsers());
        }

        /// <summary>
        /// 批量新增
        /// </summary>
        /// <param name="marriageMakePairList"></param>
        /// <param name="marriageMakePairDetailList"></param>
        public void BulkCopyInsert(List<Dictionary<string, object>> marriageMakePairList, List<Dictionary<string, object>> marriageMakePairDetailList)
        {
            _MarriageMakePair.DeleteMarriageMakePair();
            _MarriageMakePairDetail.DeleteMarriageMakePairDetail();

            _MarriageMakePair.BulkCopyInsert(marriageMakePairList);
            _MarriageMakePairDetail.BulkCopyInsert(marriageMakePairDetailList);
        }
    }
}
