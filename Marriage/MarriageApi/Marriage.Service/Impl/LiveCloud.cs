using Marriage.Entity.Service.LiveCloud;
using System;
using System.Collections.Generic;
using System.Text;
using TencentCloud.Common;
using TencentCloud.Common.Profile;
using TencentCloud.Live.V20180801;
using TencentCloud.Live.V20180801.Models;
using TencentCloud.Trtc.V20190722;
using TencentCloud.Trtc.V20190722.Models;
using TencentCloud.Vod.V20180717;
using TencentCloud.Vod.V20180717.Models;
using System.Linq;

namespace Marriage.Service.Impl
{
    /// <summary>
    /// 腾讯云
    /// </summary>
    public class LiveCloud : BaseService, ILiveCloud
    {
        /// <summary>
        /// 启动云端混流
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public StartMixedStreamResponse StartMixedStream(StartMixedStreamRequest request)
        {
            StartMixedStreamResponse response = new StartMixedStreamResponse();

            TrtcClient client = new TrtcClient(getCredential(request.SecretId, request.SecretKey), "ap-guangzhou", getClientProfile(request.Endpoint));
            var req = StartMCUMixTranscodeRequest.FromJsonString<StartMCUMixTranscodeRequest>(Utility.Common.ToJson(request.RequestParameter));

            try
            {
                client.StartMCUMixTranscodeSync(req);
            }
            catch (Exception ex)
            {
                response.ErrCode = -1;
                response.ErrMsg = ex.Message;
            }

            return response;
        }

        ClientProfile getClientProfile(string endpoint)
        {
            ClientProfile clientProfile = new ClientProfile();
            HttpProfile httpProfile = new HttpProfile();
            httpProfile.Endpoint = endpoint;
            clientProfile.HttpProfile = httpProfile;
            return clientProfile;
        }

        Credential getCredential(string secretId, string secretKey)
        {
            return new Credential
            {
                SecretId = secretId,
                SecretKey = secretKey
            };
        }


        /// <summary>
        /// 创建通用混流
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public CreateLiveMixedStreamResponse CreateLiveMixedStream(CreateLiveMixedStreamRequest request)
        {
            CreateLiveMixedStreamResponse response = new CreateLiveMixedStreamResponse();

            LiveClient client = new LiveClient(getCredential(request.SecretId, request.SecretKey), string.Empty, getClientProfile(request.Endpoint));
            var req = CreateCommonMixStreamRequest.FromJsonString<CreateCommonMixStreamRequest>(Utility.Common.ToJson(request.RequestParameter));

            try
            {
                client.CreateCommonMixStreamSync(req);
            }
            catch (Exception ex)
            {
                if (!ex.Message.Contains("InnerErrCode:[ -31001 ]"))
                {
                    response.ErrCode = -1;
                    response.ErrMsg = ex.Message;
                }
            }
            return response;
        }

        /// <summary>
        /// 取消通用混流
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public CancelLiveMixedStreamResponse CancelLiveMixedStream(CancelLiveMixedStreamRequest request)
        {
            CancelLiveMixedStreamResponse response = new CancelLiveMixedStreamResponse();

            LiveClient client = new LiveClient(getCredential(request.SecretId, request.SecretKey), string.Empty, getClientProfile(request.Endpoint));
            var req = CancelCommonMixStreamRequest.FromJsonString<CancelCommonMixStreamRequest>(Utility.Common.ToJson(new { MixStreamSessionId = request.MixStreamSessionId}));

            try
            {
                 client.CancelCommonMixStreamSync(req);
            }
            catch 
            {
            }
            return response;
        }

        /// <summary>
        /// 创建录制规则
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public CreateRecordRuleResponse CreateLiveRecordRule(CreateRecordRuleRequest request)
        {
            CreateRecordRuleResponse response = new CreateRecordRuleResponse();

            LiveClient client = new LiveClient(getCredential(request.SecretId, request.SecretKey), string.Empty, getClientProfile(request.Endpoint));
            var req = CreateLiveRecordRuleRequest.FromJsonString<CreateLiveRecordRuleRequest>(Utility.Common.ToJson(request.RequestParameter));

            try
            {
                client.CreateLiveRecordRuleSync(req);
            }
            catch (Exception ex)
            {
                response.ErrCode = -1;
                response.ErrMsg = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// 编辑视频
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public EditMediaStreamResponse EditMediaStream(EditMediaStreamRequest request)
        {
            EditMediaStreamResponse response = new EditMediaStreamResponse();

            VodClient client = new VodClient(getCredential(request.SecretId, request.SecretKey), string.Empty, getClientProfile(request.Endpoint));
            var req = EditMediaRequest.FromJsonString<EditMediaRequest>(Utility.Common.ToJson(request.RequestParameter));

            try
            {
                var res = client.EditMediaSync(req);
                response.TaskId = res.TaskId;
            }
            catch (Exception ex)
            {
                response.ErrCode = -1;
                response.ErrMsg = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// 查询所有流的流量数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public QueryStreamDayPlayInfoListResponse QueryStreamDayPlayInfoList(QueryStreamDayPlayInfoListRequest request)
        {
            QueryStreamDayPlayInfoListResponse response = new QueryStreamDayPlayInfoListResponse();

            LiveClient client = new LiveClient(getCredential(request.SecretId, request.SecretKey), string.Empty, getClientProfile(request.Endpoint));
            var req = DescribeStreamDayPlayInfoListRequest.FromJsonString<DescribeStreamDayPlayInfoListRequest>(Utility.Common.ToJson(request.RequestParameter));

            try
            {
                var res = client.DescribeStreamDayPlayInfoListSync(req);
                response.DataInfoList = (from a in res.DataInfoList
                                         select new Entity.Service.LiveCloud.PlayDataInfoByStream()
                                         {
                                             TotalFlux = a.TotalFlux ?? 0,
                                             StreamName = a.StreamName
                                         }).ToList();
                response.PageNum = res.PageNum ?? 0;
                response.PageSize = res.PageSize ?? 0;
                response.TotalNum = res.TotalNum ?? 0;
                response.TotalPage = res.TotalPage ?? 0;
            }
            catch (Exception ex)
            {
                response.ErrCode = -1;
                response.ErrMsg = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// 获取流名称下视频文件响应
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetMediaListRespponse GetMediaList(GetMediaListRequest request)
        {
            GetMediaListRespponse response = new GetMediaListRespponse();

            VodClient client = new VodClient(getCredential(request.SecretId, request.SecretKey), string.Empty, getClientProfile(request.Endpoint));
            var req = SearchMediaRequest.FromJsonString<SearchMediaRequest>(Utility.Common.ToJson(request.RequestParameter));

            try
            {
                var res = client.SearchMediaSync(req);
                response.FileIdList = res.MediaInfoSet.Select(s => s.FileId).ToList();
            }
            catch (Exception ex)
            {
                response.ErrCode = -1;
                response.ErrMsg = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// 删除视频文件
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public Entity.Service.LiveCloud.DeleteMediaResponse DeleteMedia(Entity.Service.LiveCloud.DeleteMediaRequest request)
        {
            Entity.Service.LiveCloud.DeleteMediaResponse response = new Entity.Service.LiveCloud.DeleteMediaResponse();

            VodClient client = new VodClient(getCredential(request.SecretId, request.SecretKey), string.Empty, getClientProfile(request.Endpoint));
            var req = TencentCloud.Vod.V20180717.Models.DeleteMediaRequest.FromJsonString<TencentCloud.Vod.V20180717.Models.DeleteMediaRequest>(Utility.Common.ToJson(request.RequestParameter));

            try
            {
                client.DeleteMediaSync(req);
            }
            catch (Exception ex)
            {
                response.ErrCode = -1;
                response.ErrMsg = ex.Message;
            }

            return response;
        }


        /// <summary>
        /// 获取房间信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetRoomInformationResponse GetRoomInformation(GetRoomInformationRequest request)
        {
            GetRoomInformationResponse response = new GetRoomInformationResponse();

            TrtcClient client = new TrtcClient(getCredential(request.SecretId, request.SecretKey), "ap-guangzhou", getClientProfile(request.Endpoint));
            var req = DescribeRoomInformationRequest.FromJsonString<DescribeRoomInformationRequest>(Utility.Common.ToJson(request.RequestParameter));

            try
            {
                var res = client.DescribeRoomInformationSync(req);
                response.Total = res.Total ?? 0;
                response.RoomList = (from a in res.RoomList
                                     select new Entity.Service.LiveCloud.RoomState()
                                     {
                                         IsFinished = a.IsFinished ?? false,
                                         CommId = a.CommId,
                                         CreateTime = a.CreateTime ?? 0,
                                         DestroyTime = a.DestroyTime ?? 0,
                                         RoomString = a.RoomString,
                                         UserId = a.UserId
                                     }).ToList();
            }
            catch (Exception ex)
            {
                response.ErrCode = -1;
                response.ErrMsg = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// 查询用户列表与通话指标
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetCallDetailResponse GetCallDetail(GetCallDetailRequest request)
        {
            GetCallDetailResponse response = new GetCallDetailResponse();

            TrtcClient client = new TrtcClient(getCredential(request.SecretId, request.SecretKey), "ap-guangzhou", getClientProfile(request.Endpoint));
            var req = DescribeCallDetailRequest.FromJsonString<DescribeCallDetailRequest>(Utility.Common.ToJson(request.RequestParameter));

            try
            {
                var res = client.DescribeCallDetailSync(req);
                response.Total = res.Total ?? 0;
                if (res.UserList != null) response.UserList = (from a in res.UserList
                                                               select new Entity.Service.LiveCloud.UserInformation()
                                                               {
                                                                   Finished = a.Finished ?? false,
                                                                   ClientIp = a.ClientIp,
                                                                   DeviceType = a.DeviceType,
                                                                   JoinTs = a.JoinTs ?? 0,
                                                                   LeaveTs = a.LeaveTs ?? 0,
                                                                   RoomStr = a.RoomStr,
                                                                   SdkVersion = a.SdkVersion,
                                                                   UserId = a.UserId
                                                               }).ToList();
            }
            catch (Exception ex)
            {
                response.ErrCode = -1;
                response.ErrMsg = ex.Message;
            }

            return response;
        }
    }
}
