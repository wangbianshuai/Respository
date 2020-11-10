using Marriage.Entity.Application.MarriageUser;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 相亲人员
    /// </summary>
    public interface IMarriageUser
    {
        /// <summary>
        /// 以微信OpenId获取用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>

        GetUserByOpenIdResponse GetUserByOpenId(GetUserByOpenIdRequest request);

        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        RegisterResponse Register(RegisterRequest request);

        /// <summary>
        /// 获取用户信息
        /// </summary>
        GetUserInfoResponse GetUserInfo(GetUserInfoRequest request);

        /// <summary>
        /// 获取用户信息
        /// </summary>
        GetUserResponse GetUser(GetUserRequest request);

        /// <summary>
        /// 获取用户条件类型列表
        /// </summary>
        GetUserConditionTypesResponse GetUserConditionTypes(GetUserConditionTypesRequest request);

        /// <summary>
        /// 更新用户信息
        /// </summary>
        UpdateUserInfoResponse UpdateUserInfo(UpdateUserInfoRequest request);

        /// <summary>
        /// 获取用户条件类型
        /// </summary>
        GetUserConditionTypeResponse GetUserConditionType(GetUserConditionTypeRequest request);

        /// <summary>
        /// 保存用户条件类型
        /// </summary>
        SaveUserConditionTypeResponse SaveUserConditionType(SaveUserConditionTypeRequest request);

        /// <summary>
        /// 查询红娘下相亲人员列表
        /// </summary>
        QueryUsersByMatchmakerResponse QueryUsersByMatchmaker(QueryUsersByMatchmakerRequest request);

        /// <summary>
        /// 获取红娘下用户信息
        /// </summary>
        GetUserByMatchmakerResponse GetUserByMatchmaker(GetUserByMatchmakerRequest request);

        /// <summary>
        /// 获取红娘下用户条件类型
        /// </summary>
        GetUserConditionTypeByMatchmakerResponse GetUserConditionTypeByMatchmaker(GetUserConditionTypeByMatchmakerRequest request);
    }
}
