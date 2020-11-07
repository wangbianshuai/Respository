using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 相亲人员照片
    /// </summary>
    public interface IMarriageUserPhoto
    {/// <summary>
        /// 以用户Id获取实体数据列表
        /// </summary>
        /// <param name="marriageUserId"></param>
        /// <returns></returns>
        List<IEntityData> GetEnityDataListByUserId(Guid marriageUserId);

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        Guid Insert(IEntityData entityData);
    }
}
