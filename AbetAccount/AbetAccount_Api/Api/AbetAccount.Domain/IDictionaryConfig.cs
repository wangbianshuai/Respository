using System;
using System.Collections.Generic;
using System.Text;

namespace AbetAccount.Domain
{
    /// <summary>
    /// 键值配置
    /// </summary>
    public interface IDictionaryConfig
    {
        /// <summary>
        /// 以类型集合获取键值配置列表
        /// </summary>
        /// <param name="typeList"></param>
        /// <returns></returns>
        List<Entity.Domain.DictionaryConfig> GetDictionaryConfigByTypeList(List<string> typeList);

        /// <summary>
        /// 以名称获取键值配置
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        Entity.Domain.DictionaryConfig GetDictionaryConfigByName(string name);

        /// <summary>
        /// 以名称集合获取键值配置集合
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        List<Entity.Domain.DictionaryConfig> GetDictionaryConfigListByNames(List<string> nameList);
    }
}
