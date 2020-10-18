using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 键值配置
    /// </summary>
    public class DictionaryConfig : IDictionaryConfig
    {
        public Data.IDictionaryConfig _DictionaryConfig { get; set; }

        /// <summary>
        /// 以类型集合获取键值配置列表
        /// </summary>
        /// <param name="typeList"></param>
        /// <returns></returns>
        public List<Entity.Domain.DictionaryConfig> GetDictionaryConfigByTypeList(List<string> typeList)
        {
            return Parse.IEntityDataListTo<Entity.Domain.DictionaryConfig>(_DictionaryConfig.GetEntityDataListByTypeList(typeList));
        }

        /// <summary>
        /// 以名称集合获取键值配置集合
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public List<Entity.Domain.DictionaryConfig> GetDictionaryConfigListByNames(List<string> nameList)
        {
            return Parse.IEntityDataListTo<Entity.Domain.DictionaryConfig>(_DictionaryConfig.GetDictionaryConfigListByNames(nameList));
        }

        /// <summary>
        /// 以名称获取键值配置
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public Entity.Domain.DictionaryConfig GetDictionaryConfigByName(string name)
        {
            return Parse.IEntityDataTo<Entity.Domain.DictionaryConfig>(_DictionaryConfig.GetEntityDataByName(name));
        }
    }
}
