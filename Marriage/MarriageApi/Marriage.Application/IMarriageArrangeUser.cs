using Marriage.Entity.Application.MarriageArrangeUser;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 相亲安排用户
    /// </summary>
    public interface IMarriageArrangeUser
    {
        /// <summary>
        /// 获取红娘下用户信息
        /// </summary>
        GetMarriageArrangeUserByMatchmakerResponse GetUserByMatchmaker(GetMarriageArrangeUserByMatchmakerRequest request);

        /// <summary>
        /// 获取红娘下用户条件类型
        /// </summary>
        GetMarriageArrangeUserConditionTypeByMatchmakerResponse GetUserConditionTypeByMatchmaker(GetMarriageArrangeUserConditionTypeByMatchmakerRequest request);

        /// <summary>
        /// 获取红娘下用户条件类型列表
        /// </summary>
        GetMarriageArrangeUserConditionTypesByMatchmakerResponse GetUserConditionTypesByMatchmaker(GetMarriageArrangeUserConditionTypesByMatchmakerRequest request);

        /// <summary>
        /// 获取红娘下用户信息
        /// </summary>
        GetMarriageArrangeUserInfoByMatchmakerResponse GetUserInfoByMatchmaker(GetMarriageArrangeUserInfoByMatchmakerRequest request);
    }
}
