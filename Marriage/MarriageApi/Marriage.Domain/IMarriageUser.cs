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
    }
}
