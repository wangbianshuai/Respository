using Marriage.Entity.Application;
using Marriage.Entity.Application.Live;
using Marriage.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Marriage.Application.Impl
{
    public class Live : BaseAction, ILive
    {
        public Domain.ILive _Live { get; set; }

        public Domain.IDictionaryConfig _DictionaryConfig { get; set; }

        public Domain.ILeanCloud _LeanCloud { get; set; }

        public Domain.ILiveUserStatus _LiveUserStatus { get; set; }

        public Domain.ILiveCloud _LiveCloud { get; set; }

        public Domain.ILiveStreamPlayInfo _LiveStreamPlayInfo { get; set; }

        public Domain.ILiveFeePrice _LiveFeePrice { get; set; }

        public Domain.ILiveRoomCallTimeInfo _LiveRoomCallTimeInfo { get; set; }

        /// <summary>
        /// 创建直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public CreateLiveResponse CreateLive(CreateLiveRequest request)
        {
            string title = "创建直播";
            string requestContent = Utility.Common.ToJson(request);
            CreateLiveResponse response = new CreateLiveResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateCreateLiveData(stepNo, request, response);

            //2、以获取集合获取键值配置集合
            List<string> nameList = new List<string>() { "LeanCloud_MasterKey", "LeanCloud_AppID", "LeanCloud_RestApi",
             "LiveCloud_PlayDomainName","LiveCloud_PushDomainName","LiveCloud_H5HostUrl","LiveCloud_KeyValue","TRTC_SDKAppID",
              "FeePrice_VodFlux","FeePrice_TRTCTime","FeePrice_LiveStreamFlux"};

            stepNo += 1;
            var dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, nameList, response);

            //3、创建聊天室
            stepNo += 1;
            Entity.Service.LeanCloud.CreateChatRoomResponse createChatRoomResponse = CreateChatRoom(stepNo, dictionaryConfigList, request, response);

            //4、生成直播流地址
            stepNo += 1;
            Entity.Domain.Live entity = GenLiveStreamUrl(stepNo, createChatRoomResponse, dictionaryConfigList, request, response);

            //5、插入直播实体数据
            stepNo += 1;
            InsertLive(stepNo, dictionaryConfigList, entity, response);

            //6、创建直播费用价格
            stepNo += 1;
            CreateLiveFeePrice(stepNo, dictionaryConfigList, entity, response);

            if (!response.Ack.IsSuccess && response.Data != null) response.Data = null;

            //6、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<CreateLiveResponse>(title, "CreateLive", requestContent, response);
        }

        /// <summary>
        /// 更新直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public UpdateLiveResponse UpdateLive(UpdateLiveRequest request)
        {
            string title = "更新直播";
            string requestContent = Utility.Common.ToJson(request);
            UpdateLiveResponse response = new UpdateLiveResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateUpdateLiveData(stepNo, request, response);

            //2、以获取集合获取键值配置集合
            List<string> nameList = new List<string>() { "LiveCloud_KeyValue" };

            stepNo += 1;
            var dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, nameList, response);

            //3、获取直播
            stepNo += 1;
            Entity.Domain.Live entity = GetLiveByLiveId(stepNo, request.LiveId, response);

            //4、更新直播实体数据
            stepNo += 1;
            UpdateLive(stepNo, dictionaryConfigList, entity, request, response);

            //5、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<UpdateLiveResponse>(title, "UpdateLive", requestContent, response);
        }

        /// <summary>
        /// 删除直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public DeleteLiveResponse DeleteLive(DeleteLiveRequest request)
        {
            string title = "删除直播";
            string requestContent = Utility.Common.ToJson(request);
            DeleteLiveResponse response = new DeleteLiveResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateDeleteLiveData(stepNo, request, response);

            //2、获取直播
            stepNo += 1;
            Entity.Domain.Live entity = GetLiveByLiveId(stepNo, request.LiveId, response);

            //5、插入直播实体数据
            stepNo += 1;
            DeleteLive(stepNo, entity, response);

            //6、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<DeleteLiveResponse>(title, "DeleteLive", requestContent, response);
        }

        /// <summary>
        /// 以客户ID查询直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public QueryLiveByCustomerResponse QueryLiveByCustomer(QueryLiveByCustomerRequest request)
        {
            string title = "获取直播";
            string requestContent = Utility.Common.ToJson(request);
            QueryLiveByCustomerResponse response = new QueryLiveByCustomerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateQueryLiveByCustomer(stepNo, request, response);

            //2、获取键值配置
            stepNo += 1;
            List<Entity.Domain.DictionaryConfig> dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, new List<string>() { "LiveCloud_KeyValue" }, response);

            //3、以客户ID查询直播
            stepNo += 1;
            QueryLiveByCustomer(stepNo, dictionaryConfigList, request, response);

            //6、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<QueryLiveByCustomerResponse>(title, "QueryLiveByCustomer", requestContent, response);
        }

        /// <summary>
        /// 获取直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetLiveDataResponse GetLiveData(GetLiveDataRequest request)
        {
            string title = "获取直播";
            string requestContent = Utility.Common.ToJson(request);
            GetLiveDataResponse response = new GetLiveDataResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateGetLiveData2(stepNo, request, response);

            //2、获取键值配置
            stepNo += 1;
            List<Entity.Domain.DictionaryConfig> dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, new List<string>() { "LiveCloud_KeyValue" }, response);

            //3、获取直播
            stepNo += 1;
            Entity.Domain.Live entity = GetLiveByLiveId(stepNo, request.LiveId, response);

            if (response.Ack.IsSuccess) response.Data = GetLiveData(entity, dictionaryConfigList);

            //6、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetLiveDataResponse>(title, "GetLiveData", requestContent, response);
        }

        /// <summary>
        /// 获取直播
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetLiveResponse GetLive(GetLiveRequest request)
        {
            string title = "获取直播";
            string requestContent = Utility.Common.ToJson(request);
            GetLiveResponse response = new GetLiveResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateGetLiveData(stepNo, request, response);

            //2、获取键值配置
            stepNo += 1;
            List<Entity.Domain.DictionaryConfig> dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, new List<string>() { "LiveCloud_KeyValue", "TRTC_SDKAppID", "TRTC_SecretKey" }, response);

            //3、获取直播
            stepNo += 1;
            GetLiveByLiveCode(stepNo, dictionaryConfigList, request, response);

            //6、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetLiveResponse>(title, "GetLive", requestContent, response);
        }

        /// <summary>
        /// 更新直播状态
        /// </summary>
        public UpdateLiveStatusResponse UpdateLiveStatus(UpdateLiveStatusRequest request)
        {
            string title = "更新直播状态";
            string requestContent = Utility.Common.ToJson(request);
            UpdateLiveStatusResponse response = new UpdateLiveStatusResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取直播
            int stepNo = 1;
            GetLiveByLiveId(stepNo, request.LiveId, response);

            //2、更新直播状态
            stepNo += 1;
            UpdateLiveStatus(stepNo, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<UpdateLiveStatusResponse>(title, "UpdateLiveStatus", requestContent, response);
        }

        /// <summary>
        /// 保存用户状态
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public SaveUserStatusResponse SaveUserStatus(SaveUserStatusRequest request)
        {
            string title = "保存用户状态";
            string requestContent = Utility.Common.ToJson(request);
            SaveUserStatusResponse response = new SaveUserStatusResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateSaveUserStatusData(stepNo, request, response);

            //2、获取直播
            stepNo += 1;
            GetLiveByLiveId(stepNo, request.LiveId, response);

            //3、获取直播用户状态
            stepNo += 1;
            Entity.Domain.LiveUserStatus entity = GetEntityDataByLiveIdAndUserId(stepNo, request, response);

            //4、保存用户状态
            stepNo += 1;
            SaveUserStatus(stepNo, entity, request, response);

            //5、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<SaveUserStatusResponse>(title, "SaveUserStatus", requestContent, response);
        }

        /// <summary>
        /// 启动云端混流
        /// </summary>
        public StartMixedStreamResponse StartMixedStream(StartMixedStreamRequest request)
        {
            string title = "启动云端混流";
            string requestContent = Utility.Common.ToJson(request);
            StartMixedStreamResponse response = new StartMixedStreamResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateStartMixedStreamData(stepNo, request, response);

            //2、获取直播
            stepNo += 1;
            Entity.Domain.Live live = GetLiveByLiveId(stepNo, request.LiveId, response);

            //3、获取键值配置
            stepNo += 1;
            List<Entity.Domain.DictionaryConfig> dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, new List<string>() { "TencentCloud_Region", "TRTC_Endpoint", "TencentCloud_SecretKey", "TencentCloud_SecretId", "TRTC_SDKAppID" }, response);

            //4、调用启动云端混流
            stepNo += 1;
            StartMixedStream(stepNo, dictionaryConfigList, live, request, response);

            //5、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<StartMixedStreamResponse>(title, "StartMixedStream", requestContent, response);
        }

        /// <summary>
        /// 创建通用混流
        /// </summary>
        public CreateLiveMixedStreamResponse CreateLiveMixedStream(CreateLiveMixedStreamRequest request)
        {
            string title = "创建通用混流";
            string requestContent = Utility.Common.ToJson(request);
            CreateLiveMixedStreamResponse response = new CreateLiveMixedStreamResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateCreateLiveMixedStreamData(stepNo, request, response);

            //2、获取直播
            stepNo += 1;
            Entity.Domain.Live live = GetLiveByLiveId(stepNo, request.LiveId, response);

            //3、获取键值配置
            stepNo += 1;
            List<Entity.Domain.DictionaryConfig> dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, new List<string>() { "LiveCloud_Endpoint", "TencentCloud_SecretKey", "TencentCloud_SecretId" }, response);

            //4、调用创建通用混流
            stepNo += 1;
            CreateLiveMixedStream(stepNo, dictionaryConfigList, live, request, response);

            //5、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<CreateLiveMixedStreamResponse>(title, "CreateLiveMixedStream", requestContent, response);
        }

        /// <summary>
        /// 结束直播
        /// </summary>
        public EndLiveResponse EndLive(EndLiveRequest request)
        {
            string title = "结束直播";
            string requestContent = Utility.Common.ToJson(request);
            EndLiveResponse response = new EndLiveResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateEndLiveData(stepNo, request, response);

            //2、获取直播
            stepNo += 1;
            Entity.Domain.Live live = GetLiveByLiveId(stepNo, request.LiveId, response);

            //3、获取键值配置
            stepNo += 1;
            List<Entity.Domain.DictionaryConfig> dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, new List<string>() { "VodCloud_Endpoint", "TencentCloud_SecretKey", "TencentCloud_SecretId" }, response);

            //4、调用编辑视频
            stepNo += 1;
            EndMediaStream(stepNo, dictionaryConfigList, live, response);

            //5、更新直播编辑视频任务ID
            stepNo += 1;
            UpdateEditMediaTaskId(stepNo, live, response);

            //6、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<EndLiveResponse>(title, "CreateLiveMixedStream", requestContent, response);
        }

        /// <summary>
        /// 云点播编辑视频回调
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public EditMediaCallbackResponse EditMediaCallback(EditMediaCallbackRequest request)
        {
            string title = "云点播编辑视频回调";
            string requestContent = Utility.Common.ToJson(request);
            EditMediaCallbackResponse response = new EditMediaCallbackResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取直播
            int stepNo = 1;
            Entity.Domain.Live live = GetLiveByEditMediaTaskId(stepNo, request, response);

            //2、获取键值配置
            stepNo += 1;
            List<Entity.Domain.DictionaryConfig> dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, new List<string>() { "TRTC_Endpoint", "TRTC_SDKAppID", "VodCloud_Endpoint", "TencentCloud_SecretKey", "TencentCloud_SecretId" }, response);

            //3、更新编辑视频文件ID和文件URL
            stepNo += 1;
            UpdateEditMediaFileIdAndFileUrl(stepNo, request, live, response);

            //4、查询当前流名称下原视频文件
            stepNo += 1;
            List<string> fileIdList = GetVodFilesByStreaName(stepNo, dictionaryConfigList, live, response);

            //5、删除编辑视频之前原视频文件
            stepNo += 1;
            DeleteOriginVodFiles(stepNo, dictionaryConfigList, fileIdList, request, response);

            //6、获取直播实时音视频通话时长信息
            stepNo += 1;
            Entity.Domain.LiveRoomCallTimeInfo liveRoomCallTimeInfo = GetLiveRoomCallTimeInfo(stepNo, dictionaryConfigList, live, response);

            //7、新增直播实时音视频通话时长信息
            stepNo += 1;
            InsertLiveRoomCallTimeInfo(stepNo, liveRoomCallTimeInfo, response);

            //6、执行结束
            this.ExecEnd(response);

            //重试十次 结束直播与调用编辑视频接口
            if (request.EditMediaCompleteEvent != null && live != null && request.EditMediaCompleteEvent.Output == null)
            {
                int count = Utility.DataCache.GetEndLiveCount(live.LiveId);
                if (count < 10)
                {
                    Task.Run(() =>
                    {
                        Thread.Sleep(1000 * 30);
                        Utility.DataCache.AddEndLiveCount(live.LiveId, count + 1);
                        this.EndLive(new EndLiveRequest()
                        {
                            LiveId = live.LiveId
                        });
                    });
                }
            }

            //日志记录
            return this.SetReturnResponse<EditMediaCallbackResponse>(title, "EditMediaCallback", requestContent, response);
        }

        /// <summary>
        /// 同步播放流数据
        /// </summary>
        public SyncPlayStreamDataResponse SyncPlayStreamData(SyncPlayStreamDataRequest request)
        {
            string title = "同步播放流数据";
            string requestContent = Utility.Common.ToJson(request);
            SyncPlayStreamDataResponse response = new SyncPlayStreamDataResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取键值配置
            int stepNo = 1;
            List<Entity.Domain.DictionaryConfig> dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, new List<string>() { "LiveCloud_Endpoint", "LiveCloud_PlayDomainName", "TencentCloud_SecretKey", "TencentCloud_SecretId" }, response);

            //2、查询所有流的流量数据
            stepNo += 1;
            Entity.Service.LiveCloud.QueryStreamDayPlayInfoListResponse queryStreamDayPlayInfoListResponse = QueryStreamDayPlayInfoList(stepNo, dictionaryConfigList, request, response);

            //3、保存流量数据
            stepNo += 1;
            SaveStreamPlayInfo(stepNo, queryStreamDayPlayInfoListResponse, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<SyncPlayStreamDataResponse>(title, "SyncPlayStreamData", requestContent, response);
        }

        /// <summary>
        /// 新增直播实时音视频通话时长信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="entity"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool InsertLiveRoomCallTimeInfo(int stepNo, Entity.Domain.LiveRoomCallTimeInfo entity, EditMediaCallbackResponse response)
        {
            Func<bool> execStep = () =>
            {
                return _LiveRoomCallTimeInfo.Insert(entity);
            };

            return this.InsertEntityData(stepNo, "新增直播实时音视频通话时长信息", "InsertLiveRoomCallTimeInfo", response, execStep);
        }

        /// <summary>
        /// 获取直播实时音视频通话时长信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="dictionaryConfigList"></param>
        /// <param name="live"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.LiveRoomCallTimeInfo GetLiveRoomCallTimeInfo(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigList, Entity.Domain.Live live, EditMediaCallbackResponse response)
        {
            Func<Entity.Domain.LiveRoomCallTimeInfo> execStep = () =>
            {
                Entity.Domain.LiveRoomCallTimeInfo liveRoomCallTimeInfo = _LiveRoomCallTimeInfo.GetLiveRoomCallTimeInfo(dictionaryConfigList, live);
                if (!string.IsNullOrEmpty(liveRoomCallTimeInfo.ErrorMessage))
                {
                    response.Ack.IsSuccess = false;
                    response.Ack.Message = liveRoomCallTimeInfo.ErrorMessage;
                    response.Ack.Code = (int)ResponseStatusEnum.RequestSeviceFail;
                    return null;
                }
                return liveRoomCallTimeInfo;
            };

            return this.GetEntityData<Entity.Domain.LiveRoomCallTimeInfo>(stepNo, "获取直播实时音视频通话时长信息", "GetLiveRoomCallTimeInfo", response, execStep);
        }

        /// <summary>
        /// 以客户ID查询直播
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="dictionaryConfigList"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.Live> QueryLiveByCustomer(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigList, QueryLiveByCustomerRequest request, QueryLiveByCustomerResponse response)
        {
            Func<List<Entity.Domain.Live>> execStep = () =>
            {
                List<Entity.Domain.Live> dataList = null;

                if (request.IsPageInfo && request.PageIndex > 0 && request.PageSize > 0)
                {
                    Parallel.Invoke(() =>
                    {
                        dataList = _Live.QueryLiveDataListByCustomer(request);
                    },
                    () =>
                    {
                        response.PageInfo = _Live.QueryLivePageInfoByCustomer(request);
                    });
                }
                else dataList = _Live.QueryLiveDataListByCustomer(request);

                if (dataList != null) response.DataList = (from a in dataList
                                                           select GetLiveData(a, dictionaryConfigList)).ToList();

                return dataList;
            };

            return this.GetEntityDataList<Entity.Domain.Live>(stepNo, "以客户ID查询直播", "QueryLiveByCustomer", response, execStep, false);
        }
        
        /// <summary>
        /// 删除编辑视频之前原视频文件
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="fieldIdList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool DeleteOriginVodFiles(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigList, List<string> fieldIdList, EditMediaCallbackRequest request, EditMediaCallbackResponse response)
        {
            if (fieldIdList == null || fieldIdList.Count == 0) return false;

            Func<bool> execStep = () =>
            {
                fieldIdList = fieldIdList.Where(w => w != request.EditMediaCompleteEvent.Output.FileId).ToList();

                var serverResponse = _LiveCloud.DeleteMedia(dictionaryConfigList, fieldIdList);

                this.SetServiceFailedResponse(serverResponse, response);

                return response.Ack.IsSuccess;
            };

            return this.UpdateEntityData(stepNo, "删除编辑视频之前原视频文件", "DeleteOriginVodFiles", response, execStep);
        }

        /// <summary>
        /// 查询当前流名称下原视频文件
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="live"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<string> GetVodFilesByStreaName(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigList, Entity.Domain.Live live, EditMediaCallbackResponse response)
        {
            Func<List<string>> execStep = () =>
            {
                var serverResponse = _LiveCloud.GetMediaList(dictionaryConfigList, live.StreamName);

                this.SetServiceFailedResponse(serverResponse, response);

                return serverResponse.FileIdList;
            };

            return this.GetEntityDataList<string>(stepNo, "查询当前流名称下原视频文件", "GetVodFilesByStreaName", response, execStep, false);
        }

        /// <summary>
        /// 创建直播费用价格
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool CreateLiveFeePrice(int stepNo, List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live, CreateLiveResponse response)
        {
            Func<bool> execStep = () =>
            {
                return _LiveFeePrice.CreateLiveFeePrice(configs, live);
            };

            return this.InsertEntityData(stepNo, "创建直播费用价格", "CreateLiveFeePrice", response, execStep);
        }

        /// <summary>
        /// 保存流量数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="queryStreamDayPlayInfoListResponse"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool SaveStreamPlayInfo(int stepNo, Entity.Service.LiveCloud.QueryStreamDayPlayInfoListResponse queryStreamDayPlayInfoListResponse, SyncPlayStreamDataRequest request, SyncPlayStreamDataResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (queryStreamDayPlayInfoListResponse.DataInfoList == null) return false;

                _LiveStreamPlayInfo.SaveStreamPlayInfo(queryStreamDayPlayInfoListResponse.DataInfoList, request.DayTime, request.PageNum);

                return true;
            };

            return this.UpdateEntityData(stepNo, "保存流量数据", "SaveStreamPlayInfo", response, execStep);
        }

        /// <summary>
        /// 查询所有流的流量数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="dictionaryConfigList"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Service.LiveCloud.QueryStreamDayPlayInfoListResponse QueryStreamDayPlayInfoList(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigList, SyncPlayStreamDataRequest request, SyncPlayStreamDataResponse response)
        {
            Func<Entity.Service.LiveCloud.QueryStreamDayPlayInfoListResponse> execStep = () =>
            {
                var serverResponse = _LiveCloud.QueryStreamDayPlayInfoList(dictionaryConfigList, request.PlayDomain, request.DayTime, request.PageNum);

                this.SetServiceFailedResponse(serverResponse, response);

                response.PageNum = serverResponse.PageNum;
                response.TotalNum = serverResponse.TotalNum;
                response.TotalPage = serverResponse.TotalPage;

                return serverResponse;
            };

            return this.GetEntityData<Entity.Service.LiveCloud.QueryStreamDayPlayInfoListResponse>(stepNo, "查询所有流的流量数据", "QueryStreamDayPlayInfoList", response, execStep);
        }

        /// <summary>
        /// 更新编辑视频文件ID和文件URL
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="live"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool UpdateEditMediaFileIdAndFileUrl(int stepNo, EditMediaCallbackRequest request, Entity.Domain.Live live, EditMediaCallbackResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.EditMediaCompleteEvent.Output == null) return false;

                Utility.DataCache.RemoveEndLiveCount(live.LiveId);

                live.EditMediaFileId = request.EditMediaCompleteEvent.Output.FileId;
                live.EditMediaFileUrl = request.EditMediaCompleteEvent.Output.FileUrl;
                return _Live.UpdateEditMediaFileIdAndFileUrl(live);
            };

            return this.UpdateEntityData(stepNo, "更新编辑视频文件ID和文件URL", "UpdateEditMediaFileIdAndFileUrl", response, execStep);
        }

        /// <summary>
        /// 以编辑视频任务ID获取直播
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="editMediaTaskId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Live GetLiveByEditMediaTaskId(int stepNo, EditMediaCallbackRequest request, IResponse response)
        {
            Func<Entity.Domain.Live> execStep = () =>
            {
                if (request.EditMediaCompleteEvent == null || string.IsNullOrEmpty(request.EditMediaCompleteEvent.TaskId)) return null;

                return _Live.GetLiveByEditMediaTaskId(request.EditMediaCompleteEvent.TaskId);
            };

            return this.GetEntityData<Entity.Domain.Live>(stepNo, "以编辑视频任务ID获取直播", "GetLiveByEditMediaTaskId", response, execStep);
        }

        /// <summary>
        /// 更新直播编辑视频任务ID
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool UpdateEditMediaTaskId(int stepNo, Entity.Domain.Live live, EndLiveResponse response)
        {
            Func<bool> execStep = () =>
            {
                live.LiveStatus = 2;
                return _Live.UpdateEditMediaTaskId(live);
            };

            return this.UpdateEntityData(stepNo, "更新直播编辑视频任务ID", "UpdateEditMediaTaskId", response, execStep);
        }

        /// <summary>
        /// 调用编辑视频
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool EndMediaStream(int stepNo, List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live, EndLiveResponse response)
        {
            Func<bool> execStep = () =>
            {
                var serverResponse = _LiveCloud.EditMediaStream(configs, live);

                this.SetServiceFailedResponse(serverResponse, response);

                live.EditMediaTaskId = serverResponse.TaskId;

                return response.Ack.IsSuccess;
            };

            return this.UpdateEntityData(stepNo, "调用编辑视频", "EndMediaStream", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateEndLiveData(int stepNo, EndLiveRequest request, EndLiveResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.LiveId == Guid.Empty)
                {
                    this.SetValidateMessageRepsonse("直播ID不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateEndLiveData", response, execStep);
        }

        /// <summary>
        /// 调用创建通用混流
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool CreateLiveMixedStream(int stepNo, List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live, CreateLiveMixedStreamRequest request, CreateLiveMixedStreamResponse response)
        {
            Func<bool> execStep = () =>
            {
                var serverResponse = _LiveCloud.CreateLiveMixedStream(request.InputStreamList, configs, live);

                this.SetServiceFailedResponse(serverResponse, response);

                return response.Ack.IsSuccess;
            };

            return this.UpdateEntityData(stepNo, "调用创建通用混流", "CreateLiveMixedStream", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateCreateLiveMixedStreamData(int stepNo, CreateLiveMixedStreamRequest request, CreateLiveMixedStreamResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.LiveId == Guid.Empty)
                {
                    this.SetValidateMessageRepsonse("直播ID不能为空", response);
                }
                else if (request.InputStreamList == null)
                {
                    this.SetValidateMessageRepsonse("混流输入流列表不能为空或空数组", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateCreateLiveMixedStreamData", response, execStep);
        }

        /// <summary>
        /// 调用启动云端混流
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool StartMixedStream(int stepNo, List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live, StartMixedStreamRequest request, StartMixedStreamResponse response)
        {
            Func<bool> execStep = () =>
            {
                var serverResponse = _LiveCloud.StartMixedStream(request.LayoutParams, configs, live);

                this.SetServiceFailedResponse(serverResponse, response);

                return response.Ack.IsSuccess;
            };

            return this.UpdateEntityData(stepNo, "调用启动云端混流", "StartMixedStream", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateStartMixedStreamData(int stepNo, StartMixedStreamRequest request, StartMixedStreamResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.LiveId == Guid.Empty)
                {
                    this.SetValidateMessageRepsonse("直播ID不能为空", response);
                }
                else if (request.LayoutParams == null)
                {
                    this.SetValidateMessageRepsonse("混流布局参数不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateStartMixedStreamData", response, execStep);
        }

        /// <summary>
        /// 保存用户状态
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="entity"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool SaveUserStatus(int stepNo, Entity.Domain.LiveUserStatus entity, SaveUserStatusRequest request, SaveUserStatusResponse response)
        {
            Func<bool> execStep = () =>
            {
                return _LiveUserStatus.SaveUserStatus(new Entity.Domain.LiveUserStatus()
                {
                    LiveId = request.LiveId,
                    UserId = request.UserId,
                    Status = (byte)(request.Status ? 1 : 0),
                    StatusType = request.StatusType,
                    UserStatusId = entity == null ? Guid.Empty : entity.UserStatusId
                });
            };

            return this.UpdateEntityData(stepNo, "保存用户状态", "SaveUserStatus", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateSaveUserStatusData(int stepNo, SaveUserStatusRequest request, SaveUserStatusResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.LiveId == Guid.Empty)
                {
                    this.SetValidateMessageRepsonse("直播ID不能为空", response);
                }
                else if (string.IsNullOrEmpty(request.UserId))
                {
                    this.SetValidateMessageRepsonse("用户ID不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateSaveUserStatusData", response, execStep);
        }

        /// <summary>
        /// 获取直播用户状态
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.LiveUserStatus GetEntityDataByLiveIdAndUserId(int stepNo, SaveUserStatusRequest request, IResponse response)
        {
            Func<Entity.Domain.LiveUserStatus> execStep = () =>
            {
                return _LiveUserStatus.GetEntityDataByLiveIdAndUserId(request.LiveId, request.UserId);
            };

            return this.GetEntityData<Entity.Domain.LiveUserStatus>(stepNo, "获取直播用户状态", "GetEntityDataByLiveIdAndUserId", response, execStep, false);
        }

        /// <summary>
        /// 更新直播状态
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool UpdateLiveStatus(int stepNo, UpdateLiveStatusRequest request, UpdateLiveStatusResponse response)
        {
            Func<bool> execStep = () =>
            {
                return _Live.UpdateLiveStatus(new Entity.Domain.Live() { LiveId = request.LiveId, StatusType = request.StatusType, LiveStatus = request.LiveStatus, Status = (byte)(request.Status ? 1 : 0) });
            };

            return this.UpdateEntityData(stepNo, "更新直播状态", "UpdateLiveStatus", response, execStep);
        }

        /// <summary>
        /// 获取直播
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="liveId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Live GetLiveByLiveId(int stepNo, Guid liveId, IResponse response)
        {
            Func<Entity.Domain.Live> execStep = () =>
            {
                return _Live.GetLiveByLiveId(liveId);
            };

            return this.GetEntityData<Entity.Domain.Live>(stepNo, "获取直播", "GetLiveByLiveId", response, execStep);
        }

        /// <summary>
        /// 获取直播
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="dictionaryConfigList"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Live GetLiveByLiveCode(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigList, GetLiveRequest request, GetLiveResponse response)
        {
            Func<Entity.Domain.Live> execStep = () =>
            {
                var entity = _Live.GetLiveByLiveCode(request.LiveCode, request.UserId);

                if (entity != null)
                {
                    Entity.Domain.DictionaryConfig keyValue = null;
                    Entity.Domain.DictionaryConfig sdkAppId = null;
                    Entity.Domain.DictionaryConfig secretKey = null;
                    dictionaryConfigList.ForEach(d =>
                    {
                        if (d.Name == "LiveCloud_KeyValue") keyValue = d;
                        else if (d.Name == "TRTC_SDKAppID") sdkAppId = d;
                        else if (d.Name == "TRTC_SecretKey") secretKey = d;
                    });

                    long ticks = Utility.Common.GetDateTotalSeconds(DateTime.Parse(entity.EndDate.ToString("yyyy-MM-dd HH:mm:ss")));
                    string txTime = ticks.ToString("X2").ToUpper();
                    string txSecret = getSecret(keyValue.Value, entity.StreamName, txTime);
                    response.ChatRoomId = entity.ChatRoomId;
                    response.LiveId = entity.LiveId;
                    response.LiveCode = entity.LiveCode;
                    response.Name = entity.Name;
                    response.StartDate = entity.StartDate.ToString("yyyy-MM-dd HH:mm:ss");
                    response.LogoImageUrl = entity.LogoImageUrl;
                    response.Sponsor = entity.Sponsor;
                    response.Summary = entity.Summary;
                    response.IsFiltering = entity.IsFiltering;
                    response.IsBanned = entity.IsBanned;
                    response.IsAllBanned = entity.IsAllBanned;
                    response.IsRemove = entity.IsRemove;
                    response.StreamName = entity.StreamName;
                    response.AssistantPassword = Common.ComputeStringMd5(entity.AassistantPassword);
                    response.SpeakerPassword = Common.ComputeStringMd5(entity.SpeakerPassword);
                    response.GuestPassword = Common.ComputeStringMd5(entity.GuestPassword);
                    response.SpeakerUserId = entity.SpeakerUserId;
                    response.SpeakerRoomId = entity.SpeakerRoomId;
                    response.LiveStatus = entity.LiveStatus;
                    response.SDKAppId = sdkAppId.Value;
                    response.UserSig = computeUserSig(int.Parse(response.SDKAppId), secretKey.Value, response.SpeakerUserId);
                    response.ShareUserSig = computeUserSig(int.Parse(response.SDKAppId), secretKey.Value, string.Concat("share_", response.SpeakerUserId));
                    response.EditMediaFileUrl = entity.EditMediaFileUrl;
                    if (!string.IsNullOrEmpty(request.GuestUserId))
                    {
                        response.GuestUserSig = computeUserSig(int.Parse(response.SDKAppId), secretKey.Value, request.GuestUserId);
                        response.GuestShareUserSig = computeUserSig(int.Parse(response.SDKAppId), secretKey.Value, string.Concat("share_", request.GuestUserId));
                    }
                    response.PlayUrl = string.Format("http://{0}/{1}/{2}.flv", entity.PlayDomainName, entity.AppName, entity.StreamName);
                    response.PushUrl = string.Format("rtmp://{0}/{1}/{2}?txSecret={3}&txTime={4}", entity.PushDomainName, entity.AppName, entity.StreamName, txSecret, txTime);
                }
                return entity;
            };

            return this.GetEntityData<Entity.Domain.Live>(stepNo, "获取直播", "GetLiveByLiveCode", response, execStep);
        }

        string computeUserSig(int sdkAppId, string secretKey, string userId)
        {
            TLSSigAPIv2 api = new TLSSigAPIv2(sdkAppId, secretKey);
            // 统一转换为UTF8，SDK内部是用UTF8编码。
            return api.GenSig(Common.UTF16To8(userId));
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateGetLiveData2(int stepNo, GetLiveDataRequest request, GetLiveDataResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.LiveId == Guid.Empty)
                {
                    this.SetValidateMessageRepsonse("直播ID不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateGetLiveData2", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateQueryLiveByCustomer(int stepNo, QueryLiveByCustomerRequest request, QueryLiveByCustomerResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.CustomerId))
                {
                    this.SetValidateMessageRepsonse("客户ID不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateQueryLiveByCustomer", response, execStep);
        }
        
        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateGetLiveData(int stepNo, GetLiveRequest request, GetLiveResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.LiveCode))
                {
                    this.SetValidateMessageRepsonse("直播房间号不能为空", response);
                }
                else if (string.IsNullOrEmpty(request.UserId))
                {
                    this.SetValidateMessageRepsonse("用户ID不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateGetLiveData", response, execStep);
        }

        /// <summary>
        /// 删除直播
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="live"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool DeleteLive(int stepNo, Entity.Domain.Live live, DeleteLiveResponse response)
        {
            if (response.Ack.IsSuccess && live.LiveStatus > 0)
            {
                this.SetValidateMessageRepsonse("直播已开始，不能删除！", response);
                return false;
            }

            Func<bool> execStep = () =>
            {
                return _Live.Delete(live.LiveId);
            };

            return this.UpdateEntityData(stepNo, "删除直播", "UpdateLive", response, execStep);
        }

        /// <summary>
        /// 更新直播实体数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="entity"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool UpdateLive(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigs, Entity.Domain.Live entity, UpdateLiveRequest request, UpdateLiveResponse response)
        {
            if (response.Ack.IsSuccess && entity.LiveStatus == 2)
            {
                this.SetValidateMessageRepsonse("直播已结束，不能更新！", response);
                return false;
            }

            Func<bool> execStep = () =>
            {
                entity.LiveId = request.LiveId;
                entity.ActivityImageUrl = request.ActivityImageUrl;
                entity.AllowPcBrowser = request.AllowPcBrowser;
                entity.FormTitle = request.FormTitle;
                entity.FormUID = request.FormUID;
                entity.LabelList = request.LabelList;
                entity.LogoImageUrl = request.LogoImageUrl;
                entity.Name = request.Name;
                entity.Sponsor = request.Sponsor;
                entity.StartDate = request.StartDate;
                entity.Summary = request.Summary;
                entity.WxIdentificationType = request.WxIdentificationType;
                entity.UpdateUser = request.AppId;

                var blSucceed = _Live.Update(entity);
                if (blSucceed) response.Data = GetLiveData(entity, dictionaryConfigs);
                return blSucceed;
            };

            return this.UpdateEntityData(stepNo, "更新直播实体数据", "UpdateLive", response, execStep);
        }

        /// <summary>
        /// 插入直播实体数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="entity"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Live InsertLive(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigs, Entity.Domain.Live entity, CreateLiveResponse response)
        {
            Func<Entity.Domain.Live> execStep = () =>
            {
                entity = _Live.Insert(entity);
                if (entity != null) response.Data = GetLiveData(entity, dictionaryConfigs);
                return entity;
            };

            Func<Entity.Domain.Live, bool> setSucceed = (data) =>
            {
                return data != null;
            };

            return this.InsertEntityData<Entity.Domain.Live>(stepNo, "插入直播实体数据", "InsertLive", response, execStep, setSucceed);
        }

        /// <summary>
        /// 生成直播流地址
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="createChatRoomResponse"></param>
        /// <param name="dictionaryConfigList"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Live GenLiveStreamUrl(int stepNo, Entity.Service.LeanCloud.CreateChatRoomResponse createChatRoomResponse,
            List<Entity.Domain.DictionaryConfig> dictionaryConfigList, CreateLiveRequest request, CreateLiveResponse response)
        {
            Func<Entity.Domain.Live> execStep = () =>
            {
                Entity.Domain.Live entity = new Entity.Domain.Live();

                entity.Name = request.Name;
                entity.CustomerId = request.CustomerId;
                entity.ChatRoomId = createChatRoomResponse.objectId;
                entity.StartDate = request.StartDate;
                entity.LogoImageUrl = request.LogoImageUrl;
                entity.Sponsor = request.Sponsor;
                entity.Summary = request.Summary;

                entity.ActivityImageUrl = request.ActivityImageUrl;
                entity.AllowPcBrowser = request.AllowPcBrowser;
                entity.FormTitle = request.FormTitle;
                entity.FormUID = request.FormUID;
                entity.LabelList = request.LabelList;
                entity.ActivityUID = request.ActivityUID;
                entity.WxIdentificationType = request.WxIdentificationType;

                entity.AassistantPassword = new Random().Next(100000, 999999).ToString();
                entity.SpeakerPassword = new Random().Next(100000, 999999).ToString();
                entity.GuestPassword = new Random().Next(100000, 999999).ToString();
                entity.SpeakerUserId = "user_" + new Random().Next(100000, 999999).ToString();
                entity.SpeakerRoomId = new Random().Next(100000, 999999).ToString();
                entity.CreateUser = request.AppId;

                if (string.IsNullOrEmpty(entity.StreamName)) entity.StreamName = ("s" + Utility.Common.GetRandomChars(6)).ToLower();

                string keyValue = string.Empty;
                dictionaryConfigList.ForEach(d =>
                {
                    if (string.IsNullOrEmpty(entity.PlayDomainName) && d.Name == "LiveCloud_PlayDomainName") entity.PlayDomainName = d.Value;
                    else if (string.IsNullOrEmpty(entity.PushDomainName) && d.Name == "LiveCloud_PushDomainName") entity.PushDomainName = d.Value;
                    else if (d.Name == "LiveCloud_H5HostUrl") entity.H5HostUrl = d.Value;
                    else if (d.Name == "LiveCloud_KeyValue") keyValue = d.Value;
                    else if (d.Name == "TRTC_SDKAppID") entity.AppName = "trtc_" + d.Value;
                });

                if (string.IsNullOrEmpty(entity.AppName)) entity.AppName = "live";

                return entity;
            };

            return this.ExecSetData<Entity.Domain.Live>(stepNo, "生成直播流地址", "GenLiveStreamUrl", response, execStep);
        }

        /// <summary>
        /// 获取直播数据
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="dictionaryConfigs"></param>
        /// <returns></returns>
        Entity.Application.Live.LiveData GetLiveData(Entity.Domain.Live entity, List<Entity.Domain.DictionaryConfig> dictionaryConfigs)
        {
            Entity.Application.Live.LiveData data = new LiveData();
            long ticks = Utility.Common.GetDateTotalSeconds(DateTime.Parse(entity.EndDate.ToString("yyyy-MM-dd HH:mm:ss")));
            string txTime = ticks.ToString("X2").ToUpper();

            string keyValue = string.Empty;
            var config = dictionaryConfigs.Where(w => w.Name == "LiveCloud_KeyValue").FirstOrDefault();
            if (config != null) keyValue = config.Value;

            data.AassistantPassword = entity.AassistantPassword;       
            data.AassistantRoomUrl = string.Format("{0}/assistant.html?code={1}", entity.H5HostUrl, entity.LiveCode);
            data.ActivityImageUrl = entity.ActivityImageUrl;
            data.AllowPcBrowser = entity.AllowPcBrowser;
            data.CustomerId = entity.CustomerId;
            data.FormTitle = entity.FormTitle;
            data.FormUID = entity.FormUID;
            data.GuestPassword = entity.GuestPassword;
            data.GuestRoomUrl = string.Format("{0}/guest.html?code={1}", entity.H5HostUrl, entity.LiveCode);
            data.LabelList = entity.LabelList;
            data.ActivityUID = entity.ActivityUID;
            data.LiveId = entity.LiveId;
            data.LogoImageUrl = entity.LogoImageUrl;
            data.Name = entity.Name;
            data.OBS_PushName = string.Format("{0}?txSecret={1}&txTime={2}", entity.StreamName, getSecret(keyValue, entity.StreamName, txTime), txTime);
            data.OBS_PushUrl = string.Format("rtmp://{0}/{1}/", entity.PushDomainName, entity.AppName);
            data.PlayRoomUrl = string.Format("{0}/play.html?code={1}", entity.H5HostUrl, entity.LiveCode);
            data.PushUrl = data.OBS_PushUrl + data.OBS_PushName;
            data.SpeakerPassword = entity.SpeakerPassword;
            data.SpeakerRoomUrl = string.Format("{0}/publish.html?code={1}", entity.H5HostUrl, entity.LiveCode);
            data.Sponsor = entity.Sponsor;
            data.StartDate = entity.StartDate;
            data.Summary = entity.Summary;
            data.WxIdentificationType = entity.WxIdentificationType;

            return data;
        }

        string getSecret(string keyValue, string streamName, string txTime)
        {
            return Common.ComputeStringMd5(string.Concat(keyValue, streamName, txTime)).ToLower();
        }

        /// <summary>
        /// 创建聊天室
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="dictionaryConfigList"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Service.LeanCloud.CreateChatRoomResponse CreateChatRoom(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigList, CreateLiveRequest request, CreateLiveResponse response)
        {
            Func<Entity.Service.LeanCloud.CreateChatRoomResponse> execStep = () =>
            {
                return _LeanCloud.CreateChatRoom(dictionaryConfigList, request.Name);
            };

            Func<Entity.Service.LeanCloud.CreateChatRoomResponse, bool> setSucceed = (data) =>
            {
                 this.SetServiceFailedResponse(data, response);

                 return response.Ack.IsSuccess;
            };

            return this.InsertEntityData<Entity.Service.LeanCloud.CreateChatRoomResponse>(stepNo, "创建聊天室", "CreateChatRoom", response, execStep, setSucceed);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateCreateLiveData(int stepNo, CreateLiveRequest request, CreateLiveResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.Name))
                {
                    this.SetValidateMessageRepsonse("名称不能为空", response);
                }
                else if (string.IsNullOrEmpty(request.CustomerId))
                {
                    this.SetValidateMessageRepsonse("客户ID不能为空", response);
                }
                else if (request.StartDate == DateTime.MinValue)
                {
                    this.SetValidateMessageRepsonse("开始时间不能为空", response);
                }
                else if (string.IsNullOrEmpty(request.LogoImageUrl))
                {
                    this.SetValidateMessageRepsonse("Logo图片地址不能为空", response);
                }
                else if (string.IsNullOrEmpty(request.Sponsor))
                {
                    this.SetValidateMessageRepsonse("主办方不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateCreateLiveData", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateUpdateLiveData(int stepNo, UpdateLiveRequest request, UpdateLiveResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.LiveId == Guid.Empty)
                {
                    this.SetValidateMessageRepsonse("直播ID不能为空", response);
                }
                else if (string.IsNullOrEmpty(request.Name))
                {
                    this.SetValidateMessageRepsonse("名称不能为空", response);
                }
                else if (request.StartDate == DateTime.MinValue)
                {
                    this.SetValidateMessageRepsonse("开始时间不能为空", response);
                }
                else if (string.IsNullOrEmpty(request.LogoImageUrl))
                {
                    this.SetValidateMessageRepsonse("Logo图片地址不能为空", response);
                }
                else if (string.IsNullOrEmpty(request.Sponsor))
                {
                    this.SetValidateMessageRepsonse("主办方不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateUpdateLiveData", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateDeleteLiveData(int stepNo, DeleteLiveRequest request, DeleteLiveResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.LiveId == Guid.Empty)
                {
                    this.SetValidateMessageRepsonse("直播ID不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateDeleteLiveData", response, execStep);
        }

        /// <summary>
        /// 获取类型名称集合键值配置
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="nameList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.DictionaryConfig> GetDictionaryConfigListByNames(int stepNo, List<string> nameList, IResponse response)
        {
            Func<List<Entity.Domain.DictionaryConfig>> execStep = () =>
            {
                return _DictionaryConfig.GetDictionaryConfigListByNames(nameList);
            };

            return this.GetEntityDataList<Entity.Domain.DictionaryConfig>(stepNo, "获取类型名称集合键值配置", "GetDictionaryConfigListByNames", response, execStep);
        }
    }
}
