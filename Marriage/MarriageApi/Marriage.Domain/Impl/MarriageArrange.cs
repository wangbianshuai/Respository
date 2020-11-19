﻿using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 相亲安排
    /// </summary>
    public class MarriageArrange : IMarriageArrange
    {
        public Data.IMarriageArrange _MarriageArrange { get; set; }

        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="request"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        public List<Entity.Domain.MarriageArrangeUser> QueryMarriageArrangeDataList(Entity.Application.MarriageArrange.QueryMarriageArrangeRequest request, byte sex)
        {
            Entity.Data.QueryInfo queryInfo = new Entity.Data.QueryInfo();
            queryInfo.ConditionList = GetConditionList(request);
            queryInfo.OrderByList = GetOrderByList(request);
            queryInfo.TableName = GetTableName(sex);

            queryInfo.PageIndex = request.PageIndex;
            queryInfo.PageSize = request.PageSize;

            return Parse.IEntityDataListTo<Entity.Domain.MarriageArrangeUser>(_MarriageArrange.QueryDataList(queryInfo));
        }

        string GetTableName(byte sex)
        {
            if (sex == 1) return "v_MarriageArrangeUser1";
            else if (sex == 2) return "v_MarriageArrangeUser2";
            return string.Empty;
        }

        /// <summary>
        /// 查询分页信息
        /// </summary>
        /// <param name="request"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        public Entity.Application.PageInfo QueryMarriageArrangePageInfo(Entity.Application.MarriageArrange.QueryMarriageArrangeRequest request, byte sex)
        {
            Entity.Data.QueryInfo queryInfo = new Entity.Data.QueryInfo();
            queryInfo.ConditionList = GetConditionList(request);
            queryInfo.OrderByList = GetOrderByList(request);
            queryInfo.TableName = GetTableName(sex);

            int totalCount = _MarriageArrange.QueryCount(queryInfo);

            return new Entity.Application.PageInfo(request.PageIndex, request.PageSize, totalCount);
        }

        List<Entity.Data.OrderByType> GetOrderByList(Entity.Application.MarriageArrange.QueryMarriageArrangeRequest request)
        {
            Entity.Data.OrderByType orderBy = new Entity.Data.OrderByType("UpdateDate", "desc");

            return new List<Entity.Data.OrderByType>() { orderBy };
        }

        List<Entity.Data.QueryCondition> GetConditionList(Entity.Application.MarriageArrange.QueryMarriageArrangeRequest request)
        {
            List<Entity.Data.QueryCondition> queryConditionList = new List<Entity.Data.QueryCondition>();

            string status = "0";
            if (request.Type == 1) status = "1";
            else if (request.Type == 2) status = "3,4,5";
            else if (request.Type == 3) status = "2,6,7";

            queryConditionList.Add(new Entity.Data.QueryCondition("Status", "in", status));

            queryConditionList.Add(new Entity.Data.QueryCondition("SelfUserId", "=", Guid.Parse(request.LoginUserId)));

            return queryConditionList;
        }

    }
}