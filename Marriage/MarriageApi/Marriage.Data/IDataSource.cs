using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 数据源
    /// </summary>
    public interface IDataSource
    {
        /// <summary>
        /// 以主键集合获取实体数据列表
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        List<IEntityData> GetEnityDataListByIds(List<Guid> ids);
    }
}
