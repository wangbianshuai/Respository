using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 相亲人员
    /// </summary>
    public class MarriageUser : IMarriageUser
    {
        public Data.IMarriageUser _MarriageUser { get; set; }

        /// <summary>
        /// 以OpenId获取用户信息
        /// </summary>
        /// <param name="openId"></param>
        /// <returns></returns>
        public Entity.Domain.MarriageUser GetUserByOpenId(string openId)
        {
            return Parse.IEntityDataTo<Entity.Domain.MarriageUser>(_MarriageUser.GetEntityDataByOpenId(openId));
        }
    }
}
