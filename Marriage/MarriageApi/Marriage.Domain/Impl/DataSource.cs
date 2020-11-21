using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 数据源
    /// </summary>
    public class DataSource : IDataSource
    {
        public Data.IDataSource _DataSource { get; set; }

        /// <summary>
        /// 获取数据源列表
        /// </summary>
        /// <returns></returns>
        public List<Entity.Domain.DataSource> GetDataSources()
        {
            List<IEntityData> entityDataList = _DataSource.GetDataSources();

            var groupby = entityDataList.GroupBy(b => b.GetValue<Guid>("DataSourceId"));

            List<Entity.Domain.DataSource> dataSourceList = new List<Entity.Domain.DataSource>();

            foreach (var a in groupby)
            {
                List<IEntityData> list = a.ToList();
                dataSourceList.Add(new Entity.Domain.DataSource()
                {
                    DataSourceId = a.Key,
                    Name = list[0].GetStringValue("Title"),
                    Items = (from c in list
                             select new Entity.Domain.DataSourceItem()
                             {
                                 ItemId = c.GetValue<Guid>("ItemId"),
                                 Name = c.GetStringValue("Name"),
                                 Value = c.GetStringValue("Value")
                             }).ToList()
                });
            }

            return dataSourceList;
        }
    }
}
