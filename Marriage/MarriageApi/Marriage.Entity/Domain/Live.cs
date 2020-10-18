using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 直播
    /// </summary>
    public class Live
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid LiveId { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 直播房间编号
        /// </summary> 
        public string LiveCode { get; set; }
        /// <summary> 
        /// 客户ID
        /// </summary> 
        public string CustomerId { get; set; }
        /// <summary> 
        /// 推流域名
        /// </summary> 
        public string PushDomainName { get; set; }
        /// <summary> 
        /// 播放域名
        /// </summary> 
        public string PlayDomainName { get; set; }
        /// <summary>
        /// 播放页面和助理页面服务地址
        /// </summary>
        public string H5HostUrl { get; set; }
        /// <summary> 
        /// App名称
        /// </summary> 
        public string AppName { get; set; }
        /// <summary> 
        /// 流名称
        /// </summary> 
        public string StreamName { get; set; }
        /// <summary> 
        /// 开始时间
        /// </summary> 
        public DateTime StartDate { get; set; }
        /// <summary> 
        /// 结束时间
        /// </summary> 
        public DateTime EndDate { get; set; }
        /// <summary> 
        /// 聊天室ID
        /// </summary> 
        public string ChatRoomId { get; set; }
        /// <summary> 
        /// Logo图片地址
        /// </summary> 
        public string LogoImageUrl { get; set; }
        /// <summary> 
        /// 主办方
        /// </summary> 
        public string Sponsor { get; set; }
        /// <summary> 
        /// 简介
        /// </summary> 
        public string Summary { get; set; }
        /// <summary> 
        /// 助理登录密码
        /// </summary> 
        public string AassistantPassword { get; set; }
        /// <summary>
        /// 主讲登录密码
        /// </summary>
        public string SpeakerPassword { get; set; }
        /// <summary>
        /// 嘉宾登录密码
        /// </summary>
        public string GuestPassword { get; set; }
        /// <summary>
        /// 直播状态，0：未开始，1：直播中，2：已结束
        /// </summary>
        public byte LiveStatus { get; set; }
        /// <summary> 
        /// 是否录制
        /// </summary> 
        public byte IsRecord { get; set; }
        /// <summary> 
        /// 是否过滤
        /// </summary> 
        public byte IsFiltering { get; set; }
        /// <summary> 
        /// 是否全体禁言
        /// </summary> 
        public byte IsAllBanned { get; set; }

        /// <summary>
        /// 是否禁言
        /// </summary>
        public byte IsBanned { get; set; }
        /// <summary>
        /// 是否踢出
        /// </summary>
        public byte IsRemove { get; set; }

        /// <summary>
        /// 状态
        /// </summary>
        public byte Status { get; set; }
        /// <summary>
        /// 状态类型
        /// </summary>
        public byte StatusType { get; set; }

        /// <summary>
        /// 主讲用户Id
        /// </summary>
        public string SpeakerUserId { get; set; }
        /// <summary>
        /// 主讲房间Id
        /// </summary>
        public string SpeakerRoomId { get; set; }
        /// <summary>
        /// 编辑视频任务Id
        /// </summary>
        public string EditMediaTaskId { get; set; }
        /// <summary>
        /// 编辑视频输出文件ID
        /// </summary>
        public string EditMediaFileId { get; set; }
        /// <summary>
        /// 编辑视频输出文件URL
        /// </summary>
        public string EditMediaFileUrl { get; set; }
        /// <summary> 
        /// 活动图片地址
        /// </summary> 
        public string ActivityImageUrl { get; set; }
        /// <summary>
        /// 是否允许在PC上打开, 1:允许全部平台打开；2：只允许在微信中打开
        /// </summary>
        public int AllowPcBrowser { get; set; }
        /// <summary>
        ///  微信粉丝浏览器设置，1：必须关注公众号；2：静默授权；3：显式授权
        /// </summary>
        public int WxIdentificationType { get; set; }
        /// <summary>
        /// 表单UID
        /// </summary>
        public string FormUID { get; set; }
        /// <summary>
        /// 表单标题
        /// </summary>
        public string FormTitle { get; set; }
        /// <summary>
        /// 标签UID集合
        /// </summary>
        public string LabelList { get; set; }
        /// <summary> 
        /// 创建人
        /// </summary> 
        public string CreateUser { get; set; }
        /// <summary> 
        /// 更新人
        /// </summary> 
        public string UpdateUser { get; set; }
        /// <summary>
        /// 活动UID
        /// </summary>
        public string ActivityUID { get; set; }
    }
}
