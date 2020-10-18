using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 直播
    /// </summary>
    public class Live : ILive
    {
        public Data.ILive _Live { get; set; }

        public Data.ILiveUserStatus _LiveUserStatus { get; set; }

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public Entity.Domain.Live Insert(Entity.Domain.Live entity)
        {
            IEntityData entityData = new EntityData("Live");

            entity.LiveCode = getLiveCode();

            entityData.SetValue("Name", entity.Name);
            entityData.SetValue("LiveCode", entity.LiveCode);
            entityData.SetValue("CustomerId", entity.CustomerId);
            entityData.SetValue("PushDomainName", entity.PushDomainName);
            entityData.SetValue("PlayDomainName", entity.PlayDomainName);
            entityData.SetValue("AppName", entity.AppName);
            entityData.SetValue("StreamName", entity.StreamName);
            entityData.SetValue("ChatRoomId", entity.ChatRoomId);
            entityData.SetValue("StartDate", entity.StartDate);
            entityData.SetValue("Sponsor", entity.Sponsor);
            entityData.SetValue("LogoImageUrl", entity.LogoImageUrl);
            entityData.SetValue("Summary", entity.Summary);
            entityData.SetValue("AassistantPassword", entity.AassistantPassword);
            entityData.SetValue("SpeakerPassword", entity.SpeakerPassword);
            entityData.SetValue("GuestPassword", entity.GuestPassword);
            entityData.SetValue("CreateUser", entity.CreateUser);
            entityData.SetValue("SpeakerUserId", entity.SpeakerUserId);
            entityData.SetValue("SpeakerRoomId", entity.SpeakerRoomId);
            entityData.SetValue("ActivityImageUrl", entity.ActivityImageUrl);
            entityData.SetValue("AllowPcBrowser", entity.AllowPcBrowser);
            entityData.SetValue("FormTitle", entity.FormTitle);
            entityData.SetValue("FormUID", entity.FormUID);
            entityData.SetValue("LabelList", entity.LabelList);
            entityData.SetValue("ActivityUID", entity.ActivityUID);
            entityData.SetValue("WxIdentificationType", entity.WxIdentificationType);

            entity.LiveId = _Live.Insert(entityData);
            if (entity.LiveId == Guid.Empty) return null;
            return entity;
        }

        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool Update(Entity.Domain.Live entity)
        {
            IEntityData entityData = new EntityData("Live");

            entityData.SetValue("LiveId", entity.LiveId);
            entityData.SetValue("Name", entity.Name);
            entityData.SetValue("StartDate", entity.StartDate);
            entityData.SetValue("Sponsor", entity.Sponsor);
            entityData.SetValue("LogoImageUrl", entity.LogoImageUrl);
            entityData.SetValue("Summary", entity.Summary);
            entityData.SetValue("UpdateUser",entity.UpdateUser);
            entityData.SetValue("UpdateDate", DateTime.Now);
            entityData.SetValue("ActivityImageUrl", entity.ActivityImageUrl);
            entityData.SetValue("AllowPcBrowser", entity.AllowPcBrowser);
            entityData.SetValue("FormTitle", entity.FormTitle);
            entityData.SetValue("FormUID", entity.FormUID);
            entityData.SetValue("LabelList", entity.LabelList);
            entityData.SetValue("WxIdentificationType", entity.WxIdentificationType);

            return _Live.Update(entityData);
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool Delete(Guid liveId)
        {
            return _Live.DeleteById(liveId);
        }

        /// <summary>
        /// 以直播房间号获取直播
        /// </summary>
        /// <param name="liveCode"></param>
        /// <returns></returns>
        public Entity.Domain.Live GetLiveByLiveCode(string liveCode, string userId)
        {
            var entity = Parse.IEntityDataTo<Entity.Domain.Live>(_Live.GetEntityDataByLiveCode(liveCode));

            if (entity != null)
            {
                IEntityData entityData = _LiveUserStatus.GetEntityDataByLiveIdAndUserId(entity.LiveId, userId);
                if (entityData != null)
                {
                    entity.IsBanned = entityData.GetValue<byte>("IsBanned");
                    entity.IsRemove = entityData.GetValue<byte>("IsRemove");
                }
            }

            return entity;
        }

        /// <summary>
        /// 以主键获取直播
        /// </summary>
        /// <param name="liveId"></param>
        /// <returns></returns>
        public Entity.Domain.Live GetLiveByLiveId(Guid liveId)
        {
            return Parse.IEntityDataTo<Entity.Domain.Live>(_Live.GetEntityDataById(liveId));
        }

        string getLiveCode()
        {
            string liveCode = string.Empty;

            IEntityData entityData = null;

            int minVlaue = 10000000;
            int count = 0;

            do
            {
                if (count > 5) minVlaue = minVlaue * 10;

                liveCode = new Random().Next(minVlaue, minVlaue * 10 - 1).ToString();
                entityData = _Live.GetEntityDataByLiveCode(liveCode);
                count += 1;

            } while (entityData != null);

            return liveCode;
        }

        /// <summary>
        /// 更新直播状态
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool UpdateLiveStatus(Entity.Domain.Live entity)
        {
            IEntityData entityData = new EntityData("Live");

            entityData.SetValue("LiveId", entity.LiveId);
            if (entity.StatusType == 1) entityData.SetValue("IsFiltering", entity.Status);
            else if (entity.StatusType == 2) entityData.SetValue("IsAllBanned", entity.Status);
            else if (entity.StatusType == 3)
            {
                entityData.SetValue("LiveStatus", entity.LiveStatus);
                if (entity.LiveStatus == 1) entityData.SetValue("StartDate", DateTime.Now);
                else if (entity.LiveStatus == 2) entityData.SetValue("EndDate", DateTime.Now);
            }

            return _Live.Update(entityData);
        }

        /// <summary>
        /// 更新直播编辑视频任务ID
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool UpdateEditMediaTaskId(Entity.Domain.Live entity)
        {
            IEntityData entityData = new EntityData("Live");

            entityData.SetValue("LiveId", entity.LiveId);
            entityData.SetValue("EditMediaTaskId", entity.EditMediaTaskId);

            return _Live.Update(entityData);
        }

        /// <summary>
        /// 更新编辑视频文件ID和文件URL
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool UpdateEditMediaFileIdAndFileUrl(Entity.Domain.Live entity)
        {
            IEntityData entityData = new EntityData("Live");

            entityData.SetValue("LiveId", entity.LiveId);
            entityData.SetValue("EditMediaFileId", entity.EditMediaFileId);
            entityData.SetValue("EditMediaFileUrl", entity.EditMediaFileUrl);

            return _Live.Update(entityData);
        }

        /// <summary>
        /// 以编辑视频任务ID获取直播
        /// </summary>
        /// <param name="editMediaTaskId"></param>
        /// <returns></returns>
        public Entity.Domain.Live GetLiveByEditMediaTaskId(string editMediaTaskId)
        {
            return Parse.IEntityDataTo<Entity.Domain.Live>(_Live.GetLiveByEditMediaTaskId(editMediaTaskId));
        }

        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public List<Entity.Domain.Live> QueryLiveDataListByCustomer(Entity.Application.Live.QueryLiveByCustomerRequest request)
        {
            Entity.Data.QueryInfo queryInfo = new Entity.Data.QueryInfo();
            queryInfo.ConditionList = GetConditionList(request);
            queryInfo.OrderByList = GetOrderByList(request);

            queryInfo.PageIndex = request.PageIndex;
            queryInfo.PageSize = request.PageSize;

            return Parse.IEntityDataListTo<Entity.Domain.Live>(_Live.QueryDataList(queryInfo));
        }

        /// <summary>
        /// 查询分页信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public Entity.Application.PageInfo QueryLivePageInfoByCustomer(Entity.Application.Live.QueryLiveByCustomerRequest request)
        {
            Entity.Data.QueryInfo queryInfo = new Entity.Data.QueryInfo();
            queryInfo.ConditionList = GetConditionList(request);
            queryInfo.OrderByList = GetOrderByList(request);

            int totalCount = _Live.QueryCount(queryInfo);

            return new Entity.Application.PageInfo(request.PageIndex, request.PageSize, totalCount);
        }

        List<Entity.Data.OrderByType> GetOrderByList(Entity.Application.Live.QueryLiveByCustomerRequest request)
        {
            Entity.Data.OrderByType orderBy = null;
            if (request.OrderByType != null) orderBy = new Entity.Data.OrderByType(request.OrderByType.Name, request.OrderByType.Type);
            else orderBy = new Entity.Data.OrderByType("CreateDate", "desc");

            return new List<Entity.Data.OrderByType>() { orderBy };
        }

        List<Entity.Data.QueryCondition> GetConditionList(Entity.Application.Live.QueryLiveByCustomerRequest request)
        {
            List<Entity.Data.QueryCondition> queryConditionList = new List<Entity.Data.QueryCondition>();

            if (!string.IsNullOrEmpty(request.CustomerId)) queryConditionList.Add(new Entity.Data.QueryCondition("CustomerId", "=", request.CustomerId));

            if (!string.IsNullOrEmpty(request.ActivityUID)) queryConditionList.Add(new Entity.Data.QueryCondition("ActivityUID", "=", request.ActivityUID));

            if (!string.IsNullOrEmpty(request.Keyword)) queryConditionList.Add(new Entity.Data.QueryCondition("Name,LiveCode", "like", request.Keyword));

            if (request.EndDate != DateTime.MinValue) queryConditionList.Add(new Entity.Data.QueryCondition("StartDate", "<", request.EndDate.AddDays(1), "@EndDate"));

            if (request.StartDate != DateTime.MinValue) queryConditionList.Add(new Entity.Data.QueryCondition("StartDate", ">=", request.StartDate, "@StartDate"));

            return queryConditionList;
        }
    }
}
