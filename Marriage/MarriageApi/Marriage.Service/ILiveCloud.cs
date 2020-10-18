using Marriage.Entity.Service.LiveCloud;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Service
{
    /// <summary>
    /// 腾讯云
    /// </summary>
    public interface ILiveCloud
    {
        /// <summary>
        /// 启动云端混流
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        StartMixedStreamResponse StartMixedStream(StartMixedStreamRequest request);

        /// <summary>
        /// 创建通用混流
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        CreateLiveMixedStreamResponse CreateLiveMixedStream(CreateLiveMixedStreamRequest request);

        /// <summary>
        /// 取消通用混流
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        CancelLiveMixedStreamResponse CancelLiveMixedStream(CancelLiveMixedStreamRequest request);

        /// <summary>
        /// 创建录制规则
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        CreateRecordRuleResponse CreateLiveRecordRule(CreateRecordRuleRequest request);

        /// <summary>
        /// 编辑视频
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        EditMediaStreamResponse EditMediaStream(EditMediaStreamRequest request);

        /// <summary>
        /// 查询所有流的流量数据请求
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        QueryStreamDayPlayInfoListResponse QueryStreamDayPlayInfoList(QueryStreamDayPlayInfoListRequest request);

        /// <summary>
        /// 获取流名称下视频文件响应
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        GetMediaListRespponse GetMediaList(GetMediaListRequest request);

        /// <summary>
        /// 删除视频文件
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        DeleteMediaResponse DeleteMedia(DeleteMediaRequest request);

        /// <summary>
        /// 获取房间信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        GetRoomInformationResponse GetRoomInformation(GetRoomInformationRequest request);

        /// <summary>
        /// 查询用户列表与通话指标
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        GetCallDetailResponse GetCallDetail(GetCallDetailRequest request);
    }
}
