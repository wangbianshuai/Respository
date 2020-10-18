using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class ServiceInterface : EntityAccess, IServiceInterface
    {
        public ServiceInterface()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.ServiceInterface>();
        }

        /// <summary>
        /// 以名称集合获取服务接口列表
        /// </summary>
        /// <param name="nameList"></param>
        /// <returns></returns>
        public List<IEntityData> GetServiceInterfaceByNames(List<string> nameList)
        {
            if (nameList == null || nameList.Count == 0) return new List<IEntityData>();

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();

            List<string> inParameterList = new List<string>();
            nameList.ForEach(n =>
            {
                var parameterName = "@P" + Guid.NewGuid().ToString().Substring(0, 8).ToString();
                parameterList.Add(this.InParameter(parameterName, n));
                inParameterList.Add(parameterName);
            });

            IQuery query = new Query(this.EntityType.TableName);
            query.Where(string.Format("where IsDelete=0 and Name in ({0})", string.Join(",", inParameterList)), parameterList);
            return this.SelectEntities(query);
        }
    }
}
