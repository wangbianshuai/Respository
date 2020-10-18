using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.LiveCloud
{
    /// <summary>
    /// 查询用户列表与通话指标请求
    /// </summary>
    public class GetCallDetailRequest : Request, IRequest
    {
        /// <summary>
        /// SecretId
        /// </summary>
        public string SecretId { get; set; }
        /// <summary>
        /// SecretKey
        /// </summary>
        public string SecretKey { get; set; }
        /// <summary>
        /// 服务结节主机
        /// </summary>
        public string Endpoint { get; set; }
        /// <summary>
        /// 请求参数
        /// </summary>
        public GetCallDetailRequestParameter RequestParameter { get; set; }
    }

    /// <summary>
    /// 请求参数
    /// </summary>
    public class GetCallDetailRequestParameter
    {
        /// <summary>
        /// 通话 ID（唯一标识一次通话）： sdkappid_roomgString（房间号_createTime（房间创建时间，unix时间戳，单位为s
        /// </summary>
        public string CommId { get; set; }
        /// <summary>
        /// 查询开始时间，5天内。本地unix时间戳（1588031999s）
        /// </summary>
        public long StartTime { get; set; }
        /// <summary>
        /// 查询结束时间，本地unix时间戳（1588031999s）
        /// </summary>
        public long EndTime { get; set; }
        /// <summary>
        /// SdkAppId
        /// </summary>
        public string SdkAppId { get; set; }
        /// <summary>
        /// 需查询的用户数组，不填默认返回6个用户,最多可填6个用户
        /// </summary>
        public string[] UserIds { get; set; }
        /// <summary>
        /// 需查询的指标，不填则只返回用户列表，填all则返回所有指标。 appCpu：APP CPU使用率； sysCpu：系统 CPU使用率； aBit：上/下行音频码率； aBlock：音频卡顿时长； bigvBit：上/下行视频码率； bigvCapFps：视频采集帧率； bigvEncFps：视频发送帧率； bigvDecFps：渲染帧率； bigvBlock：视频卡顿时长； aLoss：上/下行音频丢包； bigvLoss：上/下行视频丢包； bigvWidth：上/下行分辨率宽； bigvHeight：上/下行分辨率高
        /// </summary>
        public string[] DataType { get; set; }

    }

    /// <summary>
    ///  查询用户列表与通话指标响应
    /// </summary>
    public class GetCallDetailResponse : Response, IResponse
    {
        /// <summary>
        /// 返回的用户总条数
        /// </summary>
        public ulong? Total { get; set; }
        /// <summary>
        /// 用户信息列表,注意：此字段可能返回 null，表示取不到有效值。
        /// </summary>
        public List<UserInformation> UserList { get; set; }
    }

    /// <summary>
    /// 用户信息
    /// </summary>
    public class UserInformation
    {
        /// <summary>
        /// 房间号
        /// </summary>
        public string RoomStr { get; set; }
        /// <summary>
        /// 用户Id
        /// </summary>
        public string UserId { get; set; }
        /// <summary>
        /// 用户进房时间
        /// </summary>
        public ulong JoinTs { get; set; }
        /// <summary>
        /// 用户退房时间，用户没有退房则返回当前时间
        /// </summary>
        public ulong LeaveTs { get; set; }
        /// <summary>
        /// 端类型
        /// </summary>
        public string DeviceType { get; set; }
        /// <summary>
        /// Sdk版本号
        /// </summary>
        public string SdkVersion { get; set; }
        /// <summary>
        /// 客户端IP地址
        /// </summary>
        public string ClientIp { get; set; }
        /// <summary>
        /// 判断用户是否已经离开房间
        /// </summary>
        public bool Finished { get; set; }

    }
}
