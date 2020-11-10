using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 相亲人员
    /// </summary>
    public interface IMarriageUser
    {
        /// <summary>
        /// 以OpenId获取用户信息
        /// </summary>
        /// <param name="openId"></param>
        /// <returns></returns>
        Entity.Domain.MarriageUser GetUserByOpenId(string openId);

        /// <summary>
        /// 创建相亲人员
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        Guid CreateMarriageUser(Entity.Domain.MarriageUser entity);

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Entity.Domain.MarriageUser GetUserInfoById(Guid id);

        /// <summary>
        /// 更新用户信息
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        bool UpdateMarriageUser(Entity.Domain.MarriageUser entity);


        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        List<Entity.Domain.MarriageUser> QueryUsersByMatchmakerDataList(Entity.Application.MarriageUser.QueryUsersByMatchmakerRequest request);

        /// <summary>
        /// 查询分页信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Entity.Application.PageInfo QueryUsersByMatchmakerPageInfo(Entity.Application.MarriageUser.QueryUsersByMatchmakerRequest request);

        /// <summary>
        /// 红娘审核相亲人员
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        bool UpdateUserStatusByMatchmaker(Entity.Domain.MarriageUser entity);
    }
}
