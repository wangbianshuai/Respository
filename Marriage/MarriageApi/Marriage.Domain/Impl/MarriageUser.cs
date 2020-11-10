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

        /// <summary>
        /// 创建相亲人员
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public Guid CreateMarriageUser(Entity.Domain.MarriageUser entity)
        {
            IEntityData entityData = new EntityData("MarriageUser");

            entityData.SetValue("Address", entity.Address);
            entityData.SetValue("Birthday", entity.Birthday);
            entityData.SetValue("BirthEight", entity.BirthEight);
            entityData.SetValue("BirthTime", entity.BirthTime);
            entityData.SetValue("City", entity.City);
            entityData.SetValue("HeadImgUrl", entity.HeadImgUrl);
            entityData.SetValue("IdCard", entity.IdCard);
            entityData.SetValue("IsPublic", entity.IsPublic);
            entityData.SetValue("LunarBirthday", entity.LunarBirthday);
            entityData.SetValue("MatchmakerId", entity.MatchmakerId);
            entityData.SetValue("Name", entity.Name);
            entityData.SetValue("NickName", entity.NickName);
            entityData.SetValue("NowAddress", entity.NowAddress);
            entityData.SetValue("OpenId", entity.OpenId);
            entityData.SetValue("Phone", entity.Phone);
            entityData.SetValue("Province", entity.Province);
            entityData.SetValue("Remark", entity.Remark);
            entityData.SetValue("Sex", entity.Sex);
            entityData.SetValue("UserId", entity.UserId);
            entityData.SetValue("CreateUser", entity.UserId);

            return _MarriageUser.Insert(entityData);
        }

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Entity.Domain.MarriageUser GetUserInfoById(Guid id)
        {
            return Parse.IEntityDataTo<Entity.Domain.MarriageUser>(_MarriageUser.GetEntityDataById(id));
        }

        /// <summary>
        /// 更新用户信息
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool UpdateMarriageUser(Entity.Domain.MarriageUser entity)
        {
            IEntityData entityData = new EntityData("MarriageUser");

            entityData.SetValue("Address", entity.Address);
            entityData.SetValue("Birthday", entity.Birthday);
            entityData.SetValue("BirthEight", entity.BirthEight);
            entityData.SetValue("BirthTime", entity.BirthTime);
            entityData.SetValue("City", entity.City);
            entityData.SetValue("HeadImgUrl", entity.HeadImgUrl);
            entityData.SetValue("IdCard", entity.IdCard);
            entityData.SetValue("IsPublic", entity.IsPublic);
            entityData.SetValue("LunarBirthday", entity.LunarBirthday);
            entityData.SetValue("Name", entity.Name);
            entityData.SetValue("NickName", entity.NickName);
            entityData.SetValue("NowAddress", entity.NowAddress);
            entityData.SetValue("Phone", entity.Phone);
            entityData.SetValue("Province", entity.Province);
            entityData.SetValue("Remark", entity.Remark);
            entityData.SetValue("Sex", entity.Sex);
            entityData.SetValue("UserId", entity.UserId);
            entityData.SetValue("UpdateUser", entity.UserId);
            entityData.SetValue("UpdateDate", DateTime.Now);

            return _MarriageUser.Update(entityData);
        }

        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public List<Entity.Domain.MarriageUser> QueryUsersByMatchmakerDataList(Entity.Application.MarriageUser.QueryUsersByMatchmakerRequest request)
        {
            Entity.Data.QueryInfo queryInfo = new Entity.Data.QueryInfo();
            queryInfo.ConditionList = GetConditionList(request);
            queryInfo.OrderByList = GetOrderByList(request);
            queryInfo.TableName = "v_MarriageUser";

            queryInfo.PageIndex = request.PageIndex;
            queryInfo.PageSize = request.PageSize;

            return Parse.IEntityDataListTo<Entity.Domain.MarriageUser>(_MarriageUser.QueryDataList(queryInfo));
        }

        /// <summary>
        /// 查询分页信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public Entity.Application.PageInfo QueryUsersByMatchmakerPageInfo(Entity.Application.MarriageUser.QueryUsersByMatchmakerRequest request)
        {
            Entity.Data.QueryInfo queryInfo = new Entity.Data.QueryInfo();
            queryInfo.ConditionList = GetConditionList(request);
            queryInfo.OrderByList = GetOrderByList(request);
            queryInfo.TableName = "v_MarriageUser";

            int totalCount = _MarriageUser.QueryCount(queryInfo);

            return new Entity.Application.PageInfo(request.PageIndex, request.PageSize, totalCount);
        }

        List<Entity.Data.OrderByType> GetOrderByList(Entity.Application.MarriageUser.QueryUsersByMatchmakerRequest request)
        {
            Entity.Data.OrderByType orderBy = null;
            if(request.Status>0) orderBy = new Entity.Data.OrderByType("UpdateStatusDate", "desc");
            else orderBy = new Entity.Data.OrderByType("CreateDate", "desc");

            return new List<Entity.Data.OrderByType>() { orderBy };
        }

        List<Entity.Data.QueryCondition> GetConditionList(Entity.Application.MarriageUser.QueryUsersByMatchmakerRequest request)
        {
            List<Entity.Data.QueryCondition> queryConditionList = new List<Entity.Data.QueryCondition>();

            queryConditionList.Add(new Entity.Data.QueryCondition("MatchmakerId", "=", Guid.Parse(request.LoginUserId)));

            queryConditionList.Add(new Entity.Data.QueryCondition("Status", "=", request.Status));

            if(!string.IsNullOrEmpty(request.Sex)) queryConditionList.Add(new Entity.Data.QueryCondition("Sex", "=", byte.Parse(request.Sex)));

            return queryConditionList;
        }

        /// <summary>
        /// 红娘审核相亲人员
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool UpdateUserStatusByMatchmaker(Entity.Domain.MarriageUser entity)
        {
            IEntityData entityData = new EntityData("MarriageUser");

            entityData.SetValue("Status", entity.Status);
            entityData.SetValue("NoPassReason", entity.NoPassReason);
            entityData.SetValue("UserId", entity.UserId);
            entityData.SetValue("UpdateStatusDate", DateTime.Now);

            return _MarriageUser.Update(entityData);
        }
    }
}
