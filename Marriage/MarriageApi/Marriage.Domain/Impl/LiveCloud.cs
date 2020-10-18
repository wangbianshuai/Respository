using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Marriage.Domain.Impl
{
    public class LiveCloud : ILiveCloud
    {
        public Service.ILiveCloud _LiveCloud { get; set; }

        /// <summary>
        /// 启动云端混流
        /// </summary>
        /// <param name="layoutParams"></param>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        public Entity.Service.LiveCloud.StartMixedStreamResponse StartMixedStream(Entity.Application.Live.LayoutParams layoutParams, List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live)
        {
            Entity.Service.LiveCloud.StartMixedStreamRequest request = new Entity.Service.LiveCloud.StartMixedStreamRequest();
            request.RequestParameter = new Entity.Service.LiveCloud.StartMixedStreamRequestParameter();

            configs.ForEach(c =>
            {
                if (c.Name == "TencentCloud_SecretId") request.SecretId = c.Value;
                else if (c.Name == "TencentCloud_SecretKey") request.SecretKey = c.Value;
                else if (c.Name == "TRTC_Endpoint") request.Endpoint = c.Value;
                else if (c.Name == "TencentCloud_Region") request.Region = c.Value;
                else if (c.Name == "TRTC_SDKAppID") request.RequestParameter.SdkAppId = int.Parse(c.Value);
            });

            request.RequestParameter.RoomId = int.Parse(live.SpeakerRoomId);
            request.RequestParameter.OutputParams = new Entity.Service.LiveCloud.OutputParams()
            {
                StreamId = live.StreamName,
                RecordId = live.StreamName + "_" + live.SpeakerRoomId
            };

            request.RequestParameter.EncodeParams = new Entity.Service.LiveCloud.EncodeParams()
            {
                AudioSampleRate = 48000,
                AudioBitrate = 64,
                AudioChannels = 2,
                VideoFramerate = 30,
                VideoBitrate = 3000,
                VideoGop = 2,
                VideoHeight = 720,
                VideoWidth = 1280
            };

            request.RequestParameter.LayoutParams = new Entity.Service.LiveCloud.LayoutParams()
            {
                Template = layoutParams.Template,
                MainVideoUserId = layoutParams.MainVideoUserId ?? "share_" + live.SpeakerUserId,
                MainVideoStreamType = layoutParams.MainVideoStreamType,
                MainVideoRightAlign = layoutParams.MainVideoRightAlign
            };

            if (layoutParams.SmallVideoLayoutParams != null)
            {
                request.RequestParameter.LayoutParams.SmallVideoLayoutParams = new Entity.Service.LiveCloud.SmallVideoLayoutParams()
                {
                    ImageHeight = layoutParams.SmallVideoLayoutParams.ImageHeight,
                    ImageWidth = layoutParams.SmallVideoLayoutParams.ImageWidth,
                    LocationX = layoutParams.SmallVideoLayoutParams.LocationX,
                    LocationY = layoutParams.SmallVideoLayoutParams.LocationY,
                    StreamType = layoutParams.SmallVideoLayoutParams.StreamType,
                    UserId = layoutParams.SmallVideoLayoutParams.UserId
                };
            }

            return _LiveCloud.StartMixedStream(request);
        }

        /// <summary>
        /// 创建通用混流
        /// </summary>
        /// <param name="inputStreamList"></param>
        /// <param name="configs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        public Entity.Service.LiveCloud.CreateLiveMixedStreamResponse CreateLiveMixedStream(List<Entity.Application.Live.CommonMixInputParam> inputStreamList, List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live)
        {

            if (inputStreamList.Count < 2)
            {
                CancelLiveMixedStream(inputStreamList, configs, live);
                return new Entity.Service.LiveCloud.CreateLiveMixedStreamResponse();
            }

            Entity.Service.LiveCloud.CreateLiveMixedStreamRequest request = new Entity.Service.LiveCloud.CreateLiveMixedStreamRequest();
            request.RequestParameter = new Entity.Service.LiveCloud.CreateCommonMixStreamRequestParameter();

            configs.ForEach(c =>
            {
                if (c.Name == "TencentCloud_SecretId") request.SecretId = c.Value;
                else if (c.Name == "TencentCloud_SecretKey") request.SecretKey = c.Value;
                else if (c.Name == "LiveCloud_Endpoint") request.Endpoint = c.Value;
            });

            request.RequestParameter.MixStreamSessionId = live.SpeakerRoomId;
            request.RequestParameter.OutputParams = new Entity.Service.LiveCloud.CommonMixOutputParams()
            {
                OutputStreamName = live.StreamName,
                OutputStreamType = 0
            };


            request.RequestParameter.InputStreamList = (from a in inputStreamList
                                                        select new Entity.Service.LiveCloud.CommonMixInputParam()
                                                        {
                                                            InputStreamName = a.InputStreamName,
                                                            LayoutParams = new Entity.Service.LiveCloud.CommonMixLayoutParams()
                                                            {
                                                                Color = a.LayoutParams.Color,
                                                                ImageHeight = a.LayoutParams.ImageHeight,
                                                                ImageLayer = a.LayoutParams.ImageLayer,
                                                                ImageWidth = a.LayoutParams.ImageWidth,
                                                                InputType = a.LayoutParams.InputType,
                                                                LocationX = a.LayoutParams.LocationX,
                                                                LocationY = a.LayoutParams.LocationY,
                                                                WatermarkId = a.LayoutParams.WatermarkId
                                                            }
                                                        }).ToList();

            return _LiveCloud.CreateLiveMixedStream(request);
        }

        void CancelLiveMixedStream(List<Entity.Application.Live.CommonMixInputParam> inputStreamList, List<Entity.Domain.DictionaryConfig> configs, Entity.Domain.Live live)
        {
            Entity.Service.LiveCloud.CancelLiveMixedStreamRequest request = new Entity.Service.LiveCloud.CancelLiveMixedStreamRequest();

            configs.ForEach(c =>
            {
                if (c.Name == "TencentCloud_SecretId") request.SecretId = c.Value;
                else if (c.Name == "TencentCloud_SecretKey") request.SecretKey = c.Value;
                else if (c.Name == "LiveCloud_Endpoint") request.Endpoint = c.Value;
            });

            request.MixStreamSessionId = live.SpeakerRoomId;

            _LiveCloud.CancelLiveMixedStream(request);
        }

        /// <summary>
        /// 创建录制规则
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        public Entity.Service.LiveCloud.CreateRecordRuleResponse CreateLiveRecordRule(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, Entity.Domain.Live live)
        {
            Entity.Service.LiveCloud.CreateRecordRuleRequest request = new Entity.Service.LiveCloud.CreateRecordRuleRequest();
            request.RequestParameter = new Entity.Service.LiveCloud.CreateLiveRecordRuleRequestParameter()
            {
                AppName = live.AppName,
                DomainName = live.PushDomainName,
                StreamName = live.StreamName
            };

            dictionaryConfigs.ForEach(c =>
            {
                if (c.Name == "TencentCloud_SecretId") request.SecretId = c.Value;
                else if (c.Name == "TencentCloud_SecretKey") request.SecretKey = c.Value;
                else if (c.Name == "LiveCloud_Endpoint") request.Endpoint = c.Value;
                else if (c.Name == "LiveCloud_TemplateId") request.RequestParameter.TemplateId = long.Parse(c.Value);
            });

            return _LiveCloud.CreateLiveRecordRule(request);
        }

        /// <summary>
        /// 编辑视频
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        public Entity.Service.LiveCloud.EditMediaStreamResponse EditMediaStream(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, Entity.Domain.Live live)
        {
            Entity.Service.LiveCloud.EditMediaStreamRequest request = new Entity.Service.LiveCloud.EditMediaStreamRequest();
            request.RequestParameter = new Entity.Service.LiveCloud.EditMediaStreamRequestParameter()
            {
                InputType = "Stream",
                StreamInfos = new List<Entity.Service.LiveCloud.EditMediaStreamInfo>()
                {
                    new Entity.Service.LiveCloud.EditMediaStreamInfo()
                    {
                        StreamId= live.StreamName
                    }
                },
                OutputConfig = new Entity.Service.LiveCloud.EditMediaOutputConfig()
                {
                    MediaName = live.StreamName + '_' + live.SpeakerRoomId
                }
            };

            dictionaryConfigs.ForEach(c =>
            {
                if (c.Name == "TencentCloud_SecretId") request.SecretId = c.Value;
                else if (c.Name == "TencentCloud_SecretKey") request.SecretKey = c.Value;
                else if (c.Name == "VodCloud_Endpoint") request.Endpoint = c.Value;
            });

            return _LiveCloud.EditMediaStream(request);
        }

        /// <summary>
        /// 查询所有流的流量数据
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="playDomain"></param>
        /// <param name="dayTime"></param>
        /// <param name="pageNum"></param>
        /// <returns></returns>
        public Entity.Service.LiveCloud.QueryStreamDayPlayInfoListResponse QueryStreamDayPlayInfoList(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, string playDomain, string dayTime, ulong pageNum)
        {
            if (string.IsNullOrEmpty(dayTime)) dayTime = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd");

            Entity.Service.LiveCloud.QueryStreamDayPlayInfoListRequest request = new Entity.Service.LiveCloud.QueryStreamDayPlayInfoListRequest();

            dictionaryConfigs.ForEach(c =>
            {
                if (c.Name == "TencentCloud_SecretId") request.SecretId = c.Value;
                else if (c.Name == "TencentCloud_SecretKey") request.SecretKey = c.Value;
                else if (c.Name == "LiveCloud_Endpoint") request.Endpoint = c.Value;
                else if (c.Name == "LiveCloud_PlayDomainName" && string.IsNullOrEmpty(playDomain)) playDomain = c.Value;
            });

            request.RequestParameter = new Entity.Service.LiveCloud.QueryStreamDayPlayInfoListRequestParameter()
            {
                DayTime = dayTime,
                PageNum = pageNum == 0 ? 1 : pageNum,
                PageSize = 1000,
                PlayDomain = playDomain,
            };

            return _LiveCloud.QueryStreamDayPlayInfoList(request);
        }

        /// <summary>
        /// 获取流名称下文件列表
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="live"></param>
        /// <returns></returns>
        public Entity.Service.LiveCloud.GetMediaListRespponse GetMediaList(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, string streamName)
        {
            Entity.Service.LiveCloud.GetMediaListRequest request = new Entity.Service.LiveCloud.GetMediaListRequest();
            request.RequestParameter = new Entity.Service.LiveCloud.GetMediaListRequestParameter()
            {
                StreamIds = new List<string>() { streamName }
            };

            dictionaryConfigs.ForEach(c =>
            {
                if (c.Name == "TencentCloud_SecretId") request.SecretId = c.Value;
                else if (c.Name == "TencentCloud_SecretKey") request.SecretKey = c.Value;
                else if (c.Name == "VodCloud_Endpoint") request.Endpoint = c.Value;
            });

            return _LiveCloud.GetMediaList(request);
        }

        /// <summary>
        /// 删除视频文件
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="fileIdList"></param>
        /// <returns></returns>
        public Entity.Service.LiveCloud.DeleteMediaResponse DeleteMedia(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, List<string> fileIdList)
        {
            Entity.Service.LiveCloud.DeleteMediaRequest request = new Entity.Service.LiveCloud.DeleteMediaRequest();
            dictionaryConfigs.ForEach(c =>
            {
                if (c.Name == "TencentCloud_SecretId") request.SecretId = c.Value;
                else if (c.Name == "TencentCloud_SecretKey") request.SecretKey = c.Value;
                else if (c.Name == "VodCloud_Endpoint") request.Endpoint = c.Value;
            });

            foreach (var fileId in fileIdList)
            {
                var response = DeleteMedia(request, fileId);
                if (response.ErrCode != 0) return response;
            }

            return new Entity.Service.LiveCloud.DeleteMediaResponse();
        }

        /// <summary>
        /// 删除视频文件
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="fileId"></param>
        /// <returns></returns>
        Entity.Service.LiveCloud.DeleteMediaResponse DeleteMedia(Entity.Service.LiveCloud.DeleteMediaRequest request, string fileId)
        {
            request.RequestParameter = new Entity.Service.LiveCloud.DeleteMediaRequestParameter()
            {
                FileId = fileId
            };

            return _LiveCloud.DeleteMedia(request);
        }

        /// <summary>
        /// 查询房间列表
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="live"></param>
        /// <param name="pageNumber"></param>
        /// <returns></returns>
        public Entity.Service.LiveCloud.GetRoomInformationResponse GetRoomInformation(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, Entity.Domain.Live live, int pageNumber)
        {
            Entity.Service.LiveCloud.GetRoomInformationRequest request = new Entity.Service.LiveCloud.GetRoomInformationRequest();

            request.RequestParameter = new Entity.Service.LiveCloud.GetRoomInformationRequestParameter()
            {
                EndTime = DateTime.Now.Ticks,
                PageNumber = pageNumber.ToString(),
                PageSize = "100",
                RoomId = live.SpeakerRoomId,
                StartTime= live.StartDate.Ticks
            };

            dictionaryConfigs.ForEach(c =>
            {
                if (c.Name == "TencentCloud_SecretId") request.SecretId = c.Value;
                else if (c.Name == "TencentCloud_SecretKey") request.SecretKey = c.Value;
                else if (c.Name == "TRTC_Endpoint") request.Endpoint = c.Value;
                else if (c.Name == "TRTC_SDKAppID") request.RequestParameter.SdkAppId = c.Value;
            });

            return _LiveCloud.GetRoomInformation(request);
        }

        /// <summary>
        /// 查询用户列表与通话指标
        /// </summary>
        /// <param name="dictionaryConfigs"></param>
        /// <param name="live"></param>
        /// <param name="commId"></param>
        /// <returns></returns>
        public Entity.Service.LiveCloud.GetCallDetailResponse GetCallDetail(List<Entity.Domain.DictionaryConfig> dictionaryConfigs, Entity.Domain.Live live, string commId)
        {
            Entity.Service.LiveCloud.GetCallDetailRequest request = new Entity.Service.LiveCloud.GetCallDetailRequest();

            request.RequestParameter = new Entity.Service.LiveCloud.GetCallDetailRequestParameter()
            {
                CommId = commId,
                EndTime = DateTime.Now.Ticks,
                StartTime = live.StartDate.Ticks
            };

            dictionaryConfigs.ForEach(c =>
            {
                if (c.Name == "TencentCloud_SecretId") request.SecretId = c.Value;
                else if (c.Name == "TencentCloud_SecretKey") request.SecretKey = c.Value;
                else if (c.Name == "TRTC_Endpoint") request.Endpoint = c.Value;
                else if (c.Name == "TRTC_SDKAppID") request.RequestParameter.SdkAppId = c.Value;
            });

            return _LiveCloud.GetCallDetail(request);
        }
    }
}
