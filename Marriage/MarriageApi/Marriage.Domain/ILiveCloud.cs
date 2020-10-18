using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 腾讯云
    /// </summary>
    public interface ILiveCloud
    {
        /// <summary>
        /// 启动云端混流
        /// </summary>
        /// <param name="layoutParams"></param>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        Entity.Service.LiveCloud.StartMixedStreamResponse StartMixedStream(Entity.Application.Live.LayoutParams layoutParams, List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live);

        /// <summary>
        /// 创建通用混流
        /// </summary>
        /// <param name="inputStreamList"></param>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        Entity.Service.LiveCloud.CreateLiveMixedStreamResponse CreateLiveMixedStream(List<Entity.Application.Live.CommonMixInputParam> inputStreamList, List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live);

        /// <summary>
        /// 创建录制规则
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        Entity.Service.LiveCloud.CreateRecordRuleResponse CreateLiveRecordRule(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, Entity.Domain.Live live);

        /// <summary>
        /// 编辑视频
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        Entity.Service.LiveCloud.EditMediaStreamResponse EditMediaStream(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, Entity.Domain.Live live);

        /// <summary>
        /// 查询所有流的流量数据
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="playDomain"></param>
        /// <param name="dayTime"></param>
        /// <param name="pageNum"></param>
        /// <returns></returns>
        Entity.Service.LiveCloud.QueryStreamDayPlayInfoListResponse QueryStreamDayPlayInfoList(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, string playDomain, string dayTime, ulong pageNum);

        /// <summary>
        /// 获取流名称下文件列表
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        Entity.Service.LiveCloud.GetMediaListRespponse GetMediaList(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, string streamName);

        /// <summary>
        /// 删除视频文件
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="fileIdList"></param>
        /// <returns></returns>
        Entity.Service.LiveCloud.DeleteMediaResponse DeleteMedia(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, List<string> fileIdList);

        /// <summary>
        /// 查询房间列表
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="live"></param>
        /// <param name="pageNumber"></param>
        /// <returns></returns>
        Entity.Service.LiveCloud.GetRoomInformationResponse GetRoomInformation(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, Entity.Domain.Live live, int pageNumber);

        /// <summary>
        /// 查询用户列表与通话指标
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="live"></param>
        /// <param name="commId"></param>
        /// <returns></returns>
        Entity.Service.LiveCloud.GetCallDetailResponse GetCallDetail(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, Entity.Domain.Live live, string commId);
    }
}
