using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 数据源选项
    /// </summary>
    public interface IDataSourceItem
    {
        /// <summary>
        /// 以数据源主键集合获取实体数据列表
        /// </summary>
        /// <param name="dataSourceIds"></param>
        /// <returns></returns>
        List<IEntityData> GetEnityDataListByDataSourceIds(List<Guid> dataSourceIds);
    }
}
