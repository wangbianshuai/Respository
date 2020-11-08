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
    }
}
