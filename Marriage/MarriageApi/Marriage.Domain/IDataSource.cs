using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 数据源
    /// </summary>
    public interface IDataSource
    {
        /// <summary>
        /// 获取数据源列表
        /// </summary>
        /// <returns></returns>
        List<Entity.Domain.DataSource> GetDataSources();
    }
}
