using Marriage.Entity.Application.MarriageUser2;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 相亲人员
    /// </summary>
    public interface IMarriageUser2
    {
        /// <summary>
        /// 获取用户下用户信息
        /// </summary>
        GetUserByUserResponse GetUserByUser(GetUserByUserRequest request);

        /// <summary>
        /// 获取用户下用户条件类型
        /// </summary>
        GetUserConditionTypeByUserResponse GetUserConditionTypeByUser(GetUserConditionTypeByUserRequest request);

        /// <summary>
        /// 获取用户下用户条件类型列表
        /// </summary>
        GetUserConditionTypesByUserResponse GetUserConditionTypesByUser(GetUserConditionTypesByUserRequest request);

        /// <summary>
        /// 获取用户下用户信息
        /// </summary>
        GetUserInfoByUserResponse GetUserInfoByUser(GetUserInfoByUserRequest request);
    }
}
