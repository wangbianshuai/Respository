using Marriage.Entity.Application.Matchmaker;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 红娘
    /// </summary>
    public interface IMatchmaker
    {
        /// <summary>
        /// 获取用户红娘
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        GetUserMatchmakerResponse GetUserMatchmaker(GetUserMatchmakerRequest request);

        /// <summary>
        /// 以微信OpenId获取红娘
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>

        GetMatchmakerByOpenIdResponse GetMatchmakerByOpenId(GetMatchmakerByOpenIdRequest request);

        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        MatchmakerRegisterResponse Register(MatchmakerRegisterRequest request);

        /// <summary>
        /// 获取红娘信息
        /// </summary>
        GetMatchmakerInfoResponse GetMatchmakerInfo(GetMatchmakerInfoRequest request);

        /// <summary>
        /// 获取红娘信息
        /// </summary>
        GetMatchmakerResponse GetMatchmaker(GetMatchmakerRequest request);


        /// <summary>
        /// 更新红娘信息
        /// </summary>
        UpdateMatchmakerInfoResponse UpdateMatchmakerInfo(UpdateMatchmakerInfoRequest request);

        /// <summary>
        /// 获取平台红娘
        /// </summary>
        GetAppMatchmakerResponse GetAppMatchmaker(GetAppMatchmakerRequest request);

        /// <summary>
        /// 获取相亲安排红娘
        /// </summary>
        GetMatchmakerByIdResponse GetMatchmakerById(GetMatchmakerByIdRequest request);
    }
}
