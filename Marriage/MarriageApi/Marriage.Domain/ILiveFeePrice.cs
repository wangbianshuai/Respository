using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 费用价格
    /// </summary>
    public interface ILiveFeePrice
    {
        /// <summary>
        /// 创建直播费用价格
        /// </summary>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        bool CreateLiveFeePrice(List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live);
    }
}
