using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 相亲广场
    /// </summary>
    public class MarriageSquare : IMarriageSquare
    {
        public Data.IMarriageSquare _MarriageSquare { get; set; }

        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="request"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        public List<Entity.Domain.MarriageSquareUser> QueryMarriageSquareDataList(Entity.Application.MarriageSquare.QueryMarriageSquareRequest request, byte sex)
        {
            Entity.Data.QueryInfo queryInfo = new Entity.Data.QueryInfo();
            queryInfo.ConditionList = GetConditionList(request, sex);
            queryInfo.OrderByList = GetOrderByList(request);
            queryInfo.TableName = GetTableName(request.Type, sex);

            queryInfo.PageIndex = request.PageIndex;
            queryInfo.PageSize = request.PageSize;

            return Parse.IEntityDataListTo<Entity.Domain.MarriageSquareUser>(_MarriageSquare.QueryDataList(queryInfo));
        }

        string GetTableName(byte type, byte sex)
        {
            if (type == 0) return "v_MarriageSquareUser";
            else if (type == 1) return "v_MarriageSquareUser1";
            else if (type == 2) return "v_MarriageSquareUser2";
            else if (type == 3 && sex == 1) return "v_MarriageSquareUser3";
            else if (type == 3 && sex == 2) return "v_MarriageSquareUser4";
            return string.Empty;
        }

        /// <summary>
        /// 查询分页信息
        /// </summary>
        /// <param name="request"></param>
        /// <param name="sex"></param>
        /// <returns></returns>
        public Entity.Application.PageInfo QueryMarriageSquarePageInfo(Entity.Application.MarriageSquare.QueryMarriageSquareRequest request, byte sex)
        {
            Entity.Data.QueryInfo queryInfo = new Entity.Data.QueryInfo();
            queryInfo.ConditionList = GetConditionList(request, sex);
            queryInfo.OrderByList = GetOrderByList(request);
            queryInfo.TableName = GetTableName(request.Type, sex);

            int totalCount = _MarriageSquare.QueryCount(queryInfo);

            return new Entity.Application.PageInfo(request.PageIndex, request.PageSize, totalCount);
        }

        List<Entity.Data.OrderByType> GetOrderByList(Entity.Application.MarriageSquare.QueryMarriageSquareRequest request)
        {
            Entity.Data.OrderByType orderBy = new Entity.Data.OrderByType("UpdateDate", "desc");

            return new List<Entity.Data.OrderByType>() { orderBy };
        }

        List<Entity.Data.QueryCondition> GetConditionList(Entity.Application.MarriageSquare.QueryMarriageSquareRequest request, byte sex)
        {
            List<Entity.Data.QueryCondition> queryConditionList = new List<Entity.Data.QueryCondition>();

            if (sex == 1) sex = 2;
            else if (sex == 2) sex = 1;

            if (request.Type == 0) queryConditionList.Add(new Entity.Data.QueryCondition("Sex", "=", sex));
            else queryConditionList.Add(new Entity.Data.QueryCondition("SelfUserId", "=", Guid.Parse(request.LoginUserId)));

            return queryConditionList;
        }

        /// <summary>
        /// 获取相亲广场
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Entity.Domain.MarriageSquare GetMarriageSquareByUserId(Guid loginUserId, Guid userId)
        {
            return Parse.IEntityDataTo<Entity.Domain.MarriageSquare>(_MarriageSquare.GetMarriageSquareUserByUserId(loginUserId, userId, 1));
        }

        /// <summary>
        /// 更新相亲广场玫瑰数
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <param name="isSend"></param>
        /// <returns></returns>
        public bool UpdateMarriageSquareRoseCount(Guid loginUserId, Guid userId, bool isSend)
        {
            if (isSend) return _MarriageSquare.UpdateMarriageSquareRoseCount(loginUserId, userId);
            else return _MarriageSquare.DeleteMarriageSquareByUserId(loginUserId, userId);
        }

        /// <summary>
        /// 新增相亲广场
        /// </summary>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public bool InsertMarriageSquare(Guid loginUserId, Guid userId)
        {
            IEntityData entityData = new EntityData("MarriageSquare");

            entityData.SetValue("UpdateDate", DateTime.Now);
            entityData.SetValue("RoseCount", 1);
            entityData.SetValue("UserId", loginUserId);
            entityData.SetValue("OtherSideUserId", userId);
            entityData.SetValue("CreateUser", loginUserId);

            return _MarriageSquare.Insert(entityData) != Guid.Empty;
        }
    }
}
