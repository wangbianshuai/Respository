using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class DictionaryConfig : EntityAccess, IDictionaryConfig
    {
        public DictionaryConfig()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.DictionaryConfig>();
        }

        /// <summary>
        /// 以类型列表获取实体数据列表
        /// </summary>
        /// <param name="typeList"></param>
        /// <returns></returns>
        public List<IEntityData> GetEntityDataListByTypeList(List<string> typeList)
        {
            if (typeList == null || typeList.Count == 0) return new List<IEntityData>();

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();

            List<string> inParameterList = new List<string>();
            typeList.ForEach(n =>
            {
                var parameterName = "@P" + Guid.NewGuid().ToString().Substring(0, 8).ToString();
                parameterList.Add(this.InParameter(parameterName, n));
                inParameterList.Add(parameterName);
            });

            IQuery query = new Query(this.EntityType.TableName);
            query.Where(string.Format("where IsDelete=0 and TypeName in ({0})", string.Join(",", inParameterList)), parameterList);
            return this.SelectEntities(query);
        }

        /// <summary>
        /// 以名称集合获取键值配置集合
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public List<IEntityData> GetDictionaryConfigListByNames(List<string> nameList)
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

        /// <summary>
        /// 以名称获取实体数据
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public IEntityData GetEntityDataByName(string name)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@Name", name));

            query.Where("where IsDelete=0 and Name=@Name", parameterList);

            return this.SelectEntity(query);
        }
    }
}
