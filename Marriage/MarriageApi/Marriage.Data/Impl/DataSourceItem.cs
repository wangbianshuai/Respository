using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class DataSourceItem : EntityAccess, IDataSourceItem
    {
        public DataSourceItem()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.DataSourceItem>();
        }

        /// <summary>
        /// 以数据源主键集合获取实体数据列表
        /// </summary>
        /// <param name="dataSourceIds"></param>
        /// <returns></returns>
        public List<IEntityData> GetEnityDataListByDataSourceIds(List<Guid> dataSourceIds)
        {
            if (dataSourceIds == null || dataSourceIds.Count == 0) return new List<IEntityData>();

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();

            List<string> inParameterList = new List<string>();
            dataSourceIds.ForEach(n =>
            {
                var parameterName = "@P" + Guid.NewGuid().ToString().Substring(0, 8).ToString();
                parameterList.Add(this.InParameter(parameterName, n));
                inParameterList.Add(parameterName);
            });

            IQuery query = new Query(this.EntityType.TableName);
            query.Where(string.Format("where DataSourceId in ({0})", string.Join(",", inParameterList)), parameterList);
            return this.SelectEntities(query);
        }
    }
}
