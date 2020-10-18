using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.LiveCloud
{
    /// <summary>
    /// 查询房间列表请求
    /// </summary>
    public class GetRoomInformationRequest : Request, IRequest
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
        public GetRoomInformationRequestParameter RequestParameter { get; set; }
    }

    /// <summary>
    /// 请求参数
    /// </summary>
    public class GetRoomInformationRequestParameter
    {
        /// <summary>
        /// 用户sdkappid
        /// </summary>
        public string SdkAppId { get; set; }
        /// <summary>
        /// 查询开始时间，5天内。本地unix时间戳（1588031999s）
        /// </summary>
        public long StartTime { get; set; }
        /// <summary>
        /// 查询结束时间，本地unix时间戳（1588031999s）
        /// </summary>
        public long EndTime { get; set; }
        /// <summary>
        /// 数字房间号
        /// </summary>
        public string RoomId { get; set; }
        /// <summary>
        /// 分页index，从0开始（PageNumber和PageSize 其中一个不填均默认返回10条数据）
        /// </summary>
        public string PageNumber { get; set; }
        /// <summary>
        /// 分页大小（PageNumber和PageSize 其中一个不填均默认返回10条数据,最大不超过100）
        /// </summary>
        public string PageSize { get; set; }
    }

    /// <summary>
    ///  查询房间列表响应
    /// </summary>
    public class GetRoomInformationResponse : Response, IResponse
    {
        /// <summary>
        /// 返回的数据总条数
        /// </summary>
        public long Total { get; set; }

        /// <summary>
        /// 房间信息列表
        /// </summary>
        public List<RoomState> RoomList { get; set; }
    }

    /// <summary>
    /// 房间信息
    /// </summary>
    public class RoomState
    {
        /// <summary>
        /// 通话ID（唯一标识一次通话）
        /// </summary>
        public string CommId { get; set; }
        /// <summary>
        /// 房间号
        /// </summary>
        public string RoomString { get; set; }
        /// <summary>
        /// 房间创建时间
        /// </summary>
        public ulong CreateTime { get; set; }
        /// <summary>
        /// 房间销毁时间
        /// </summary>
        public ulong DestroyTime { get; set; }
        /// <summary>
        /// 房间是否已经结束
        /// </summary>
        public bool IsFinished { get; set; }
        /// <summary>
        /// 房间创建者Id
        /// </summary>
        public string UserId { get; set; }
    }
}
