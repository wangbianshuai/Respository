using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 费用价格
    /// </summary>
    public class LiveFeePrice : ILiveFeePrice
    {
        public Data.ILiveFeePrice _LiveFeePrice { get; set; }

        /// <summary>
        /// 创建直播费用价格
        /// </summary>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        public bool CreateLiveFeePrice(List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live)
        {
            foreach (var config in configs)
            {
                if(config.Name== "FeePrice_LiveStreamFlux")
                {
                    if (!Insert(new Entity.Domain.LiveFeePrice()
                    {
                        FeeType = 1,
                        LiveId = live.LiveId,
                        Price = decimal.Parse(config.Value)
                    })) return false;
                }
                else if (config.Name == "FeePrice_VodFlux")
                {
                    if (!Insert(new Entity.Domain.LiveFeePrice()
                    {
                        FeeType = 2,
                        LiveId = live.LiveId,
                        Price = decimal.Parse(config.Value)
                    })) return false;
                }
                else if(config.Name == "FeePrice_TRTCTime")
                {
                    if (!Insert(new Entity.Domain.LiveFeePrice()
                    {
                        FeeType = 3,
                        LiveId = live.LiveId,
                        Price = decimal.Parse(config.Value)
                    })) return false;
                }
              
            }
            return true;
        }

        bool Insert(Entity.Domain.LiveFeePrice entity)
        {
            IEntityData entityData = new EntityData("LiveFeePrice");

            entityData.SetValue("FeeType", entity.FeeType);
            entityData.SetValue("LiveId", entity.LiveId);
            entityData.SetValue("Price", entity.Price);

            return _LiveFeePrice.Insert(entityData) != Guid.Empty;
        }
    }
}
