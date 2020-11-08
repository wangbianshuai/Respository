using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 红娘
    /// </summary>
    public interface IMatchmaker
    {
        /// <summary>
        /// 以OpenId获取红娘信息
        /// </summary>
        /// <param name="openId"></param>
        /// <returns></returns>
        Entity.Domain.Matchmaker GetMatchmakerByOpenId(string openId);

        /// <summary>
        /// 创建红娘
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        Guid CreateMatchmaker(Entity.Domain.Matchmaker entity);

        /// <summary>
        /// 以主键获取红娘信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Entity.Domain.Matchmaker GetMatchmakerById(Guid id);

        /// <summary>
        /// 更新红娘信息
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        bool UpdateMatchmaker(Entity.Domain.Matchmaker entity);
    }
}
