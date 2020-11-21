using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class DataSource : EntityAccess, IDataSource
    {
        public DataSource()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.DataSource>();
        }

        /// <summary>
        /// 以主键集合获取实体数据列表
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public List<IEntityData> GetEnityDataListByIds(List<Guid> ids)
        {
            if (ids == null || ids.Count == 0) return new List<IEntityData>();

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();

            List<string> inParameterList = new List<string>();
            ids.ForEach(n =>
            {
                var parameterName = "@P" + Guid.NewGuid().ToString().Substring(0, 8).ToString();
                parameterList.Add(this.InParameter(parameterName, n));
                inParameterList.Add(parameterName);
            });

            IQuery query = new Query(this.EntityType.TableName);
            query.Where(string.Format("where IsDelete=0 and DataSourceId in ({0})", string.Join(",", inParameterList)), parameterList);
            return this.SelectEntities(query);
        }

        /// <summary>
        /// 获取数据源列表
        /// </summary>
        /// <returns></returns>
        public List<IEntityData> GetDataSources()
        {
            IQuery query = new Query("v_DataSourceItem");

            return this.SelectEntities(query);
        }
    }
}
