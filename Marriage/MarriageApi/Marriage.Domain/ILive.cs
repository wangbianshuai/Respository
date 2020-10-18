using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 直播
    /// </summary>
    public interface ILive
    {
        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        Entity.Domain.Live Insert(Entity.Domain.Live entity);

        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        bool Update(Entity.Domain.Live entity);

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        bool Delete(Guid liveId);

        /// <summary>
        /// 以直播房间号获取直播
        /// </summary>
        /// <param name="liveCode"></param>
        /// <returns></returns>
        Entity.Domain.Live GetLiveByLiveCode(string liveCode, string userId);

        /// <summary>
        /// 以主键获取直播
        /// </summary>
        /// <param name="liveId"></param>
        /// <returns></returns>
        Entity.Domain.Live GetLiveByLiveId(Guid liveId);

        /// <summary>
        /// 更新直播状态
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        bool UpdateLiveStatus(Entity.Domain.Live entity);

        /// <summary>
        /// 更新直播编辑视频任务ID
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        bool UpdateEditMediaTaskId(Entity.Domain.Live entity);
        /// <summary>
        /// 更新编辑视频文件ID和文件URL
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        bool UpdateEditMediaFileIdAndFileUrl(Entity.Domain.Live entity);

        /// <summary>
        /// 以编辑视频任务ID获取直播
        /// </summary>
        /// <param name="editMediaTaskId"></param>
        /// <returns></returns>
        Entity.Domain.Live GetLiveByEditMediaTaskId(string editMediaTaskId);

        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        List<Entity.Domain.Live> QueryLiveDataListByCustomer(Entity.Application.Live.QueryLiveByCustomerRequest request);

        /// <summary>
        /// 查询分页信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Entity.Application.PageInfo QueryLivePageInfoByCustomer(Entity.Application.Live.QueryLiveByCustomerRequest request);
    }
}
