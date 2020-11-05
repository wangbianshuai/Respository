using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    /// <summary>
    /// 键值配置
    /// </summary>
    public interface IDictionaryConfig
    {
        /// <summary>
        /// 以类型列表获取实体数据列表
        /// </summary>
        /// <param name="typeList"></param>
        /// <returns></returns>
        List<IEntityData> GetEntityDataListByTypeList(List<string> typeList);

        /// <summary>
        /// 以名称集合获取键值配置集合
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        List<IEntityData> GetDictionaryConfigListByNames(List<string> nameList);

        /// <summary>
        /// 以名称获取实体数据
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        IEntityData GetEntityDataByName(string name);
    }
}
