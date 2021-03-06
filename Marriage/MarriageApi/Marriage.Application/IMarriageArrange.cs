﻿using Marriage.Entity.Application.MarriageArrange;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 相亲安排
    /// </summary>
    public interface IMarriageArrange
    {
        /// <summary>
        /// 查询相亲安排
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        QueryMarriageArrangeResponse QueryMarriageArrange(QueryMarriageArrangeRequest request);

        /// <summary>
        /// 获取相亲安排
        /// </summary>
        GetMarriageArrangeByUserResponse GetMarriageArrangeByUser(GetMarriageArrangeByUserRequest request);

        /// <summary>
        /// 查询红娘下相亲安排
        /// </summary>
        QueryMarriageArrangeByMatchmakerResponse QueryMarriageArrangeByMatchmaker(QueryMarriageArrangeByMatchmakerRequest request);

        /// <summary>
        /// 获取红娘下相亲安排
        /// </summary>
        GetMarriageArrangeByMatchmakerResponse GetMarriageArrangeByMatchmaker(GetMarriageArrangeByMatchmakerRequest request);

        /// <summary>
        /// 获取相亲安排信息
        /// </summary>
        GetMarriageArrangeByIdResponse GetMarriageArrangeById(GetMarriageArrangeByIdRequest request);

        /// <summary>
        /// 更新相亲安排
        /// </summary>
        UpdateMarriageArrangeResponse UpdateMarriageArrange(UpdateMarriageArrangeRequest request);
    }
}
