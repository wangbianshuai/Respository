using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{
    /// <summary>
    /// 获取直播请求
    /// </summary>
    public class GetLiveRequest : Request, IRequest
    {
        /// <summary> 
        /// 直播房间号（必填）
        /// </summary> 
        public string LiveCode { get; set; }
        /// <summary>
        /// 用户ID
        /// </summary>
        public string UserId { get; set; }
        /// <summary>
        /// 嘉宾用户ID
        /// </summary>
        public string GuestUserId { get; set; }
    }

    /// <summary>
    /// 获取直播响应
    /// </summary>
    public class GetLiveResponse : Response, IResponse
    {
        /// <summary>
        /// 主键
        /// </summary>
        public Guid LiveId { get; set; }
        /// <summary>
        /// 直播房间号
        /// </summary>
        public string LiveCode { get; set; }
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }
        /// <summary> 
        /// 推流URL
        /// </summary> 
        public string PushUrl { get; set; }
        /// <summary>
        /// 播放地址
        /// </summary>
        public string PlayUrl { get; set; }
        /// <summary> 
        /// 聊天室ID
        /// </summary> 
        public string ChatRoomId { get; set; }
        /// <summary> 
        /// 开始时间
        /// </summary> 
        public string StartDate { get; set; }
        /// <summary> 
        /// Logo图片地址
        /// </summary> 
        public string LogoImageUrl { get; set; }
        /// <summary> 
        /// 主办方
        /// </summary> 
        public string Sponsor { get; set; }
        /// <summary>
        /// 流名称
        /// </summary>
        public string StreamName { get; set; }
        /// <summary> 
        /// 简介
        /// </summary> 
        public string Summary { get; set; }
        /// <summary> 
        /// 是否过滤
        /// </summary> 
        public byte IsFiltering { get; set; }
        /// <summary>
        /// 是否禁言
        /// </summary>
        public byte IsBanned { get; set; }
        /// <summary>
        /// 是否踢出
        /// </summary>
        public byte IsRemove { get; set; }
        /// <summary>
        /// 是否全体禁言
        /// </summary>
        public byte IsAllBanned { get; set; }
        /// <summary>
        /// 是否登录
        /// </summary>
        public bool IsLogin { get; set; }
        /// <summary>
        /// 助理md5密码
        /// </summary>
        public string AssistantPassword { get; set; }
        /// <summary>
        /// 主讲md5密码
        /// </summary>
        public string SpeakerPassword { get; set; }
        /// <summary>
        /// 嘉宾md5密码
        /// </summary>
        public string GuestPassword { get; set; }
        /// <summary>
        /// TRTC SDK APPID
        /// </summary>
        public string SDKAppId { get; set; }
        /// <summary>
        /// 用户签名
        /// </summary>
        public string UserSig { get; set; }
        /// <summary>
        /// 共享屏幕用户签名
        /// </summary>
        public string ShareUserSig { get; set; }
        /// <summary>
        /// 主讲用户ID
        /// </summary>
        public string SpeakerUserId { get; set; }
        /// <summary>
        /// 主讲房间ID
        /// </summary>
        public string SpeakerRoomId { get; set; }
        /// <summary>
        /// 嘉宾用户签名
        /// </summary>
        public string GuestUserSig { get; set; }
        /// <summary>
        /// 嘉宾共享屏幕用户签名
        /// </summary>
        public string GuestShareUserSig { get; set; }
        /// <summary>
        /// 直播状态
        /// </summary>
        public byte LiveStatus { get; set; }
        /// <summary>
        /// 编辑视频输出文件URL
        /// </summary>
        public string EditMediaFileUrl { get; set; }
    }
}
