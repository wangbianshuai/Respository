using Marriage.Entity.Application.Live;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 直播
    /// </summary>
    public interface ILive
    {
        /// <summary>
        /// 创建直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        CreateLiveResponse CreateLive(CreateLiveRequest request);

        /// <summary>
        /// 更新直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        UpdateLiveResponse UpdateLive(UpdateLiveRequest request);

        /// <summary>
        /// 删除直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        DeleteLiveResponse DeleteLive(DeleteLiveRequest request);

        /// <summary>
        /// 以客户ID查询直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        QueryLiveByCustomerResponse QueryLiveByCustomer(QueryLiveByCustomerRequest request);

        /// <summary>
        /// 获取直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        GetLiveDataResponse GetLiveData(GetLiveDataRequest request);

        /// <summary>
        /// 获取直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        GetLiveResponse GetLive(GetLiveRequest request);

        /// <summary>
        /// 更新直播状态
        /// </summary>
        UpdateLiveStatusResponse UpdateLiveStatus(UpdateLiveStatusRequest request);

        /// <summary>
        /// 保存用户状态
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        SaveUserStatusResponse SaveUserStatus(SaveUserStatusRequest request);

        /// <summary>
        /// 启动云端混流
        /// </summary>
        StartMixedStreamResponse StartMixedStream(StartMixedStreamRequest request);

        /// <summary>
        /// 创建通用混流
        /// </summary>
        CreateLiveMixedStreamResponse CreateLiveMixedStream(CreateLiveMixedStreamRequest request);

        /// <summary>
        /// 结束直播
        /// </summary>
        EndLiveResponse EndLive(EndLiveRequest request);

        /// <summary>
        /// 云点播编辑视频回调
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        EditMediaCallbackResponse EditMediaCallback(EditMediaCallbackRequest request);

        /// <summary>
        /// 同步播放流数据
        /// </summary>
        SyncPlayStreamDataResponse SyncPlayStreamData(SyncPlayStreamDataRequest request);
    }
}
