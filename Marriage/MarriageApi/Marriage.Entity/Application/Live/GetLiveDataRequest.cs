using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{
    /// <summary>
    /// 获取直播请求
    /// </summary>
    public class GetLiveDataRequest : Request, IRequest
    {
        /// <summary> 
        /// 直播ID
        /// </summary> 
        public Guid LiveId { get; set; }
    }

    /// <summary>
    /// 获取直播响应
    /// </summary>
    public class GetLiveDataResponse : Response, IResponse
    {
        /// <summary>
        /// 直播数据
        /// </summary>
       public LiveData Data { get; set; }
    }

    /// <summary>
    /// 直播数据
    /// </summary>
    public class LiveData
    {
        /// <summary>
        /// 主键
        /// </summary>
        public Guid LiveId { get; set; }
        /// <summary> 
        /// 名称（必填）
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 客户ID（必填）
        /// </summary> 
        public string CustomerId { get; set; }
        /// <summary> 
        /// 开始时间（必填）
        /// </summary> 
        public DateTime StartDate { get; set; }
        /// <summary> 
        /// Logo图片地址（必填）
        /// </summary> 
        public string LogoImageUrl { get; set; }
        /// <summary> 
        /// 活动图片地址
        /// </summary> 
        public string ActivityImageUrl { get; set; }
        /// <summary> 
        /// 主办方（必填）
        /// </summary> 
        public string Sponsor { get; set; }
        /// <summary> 
        /// 简介（选填）
        /// </summary> 
        public string Summary { get; set; }
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
        /// 推流URL
        /// </summary> 
        public string PushUrl { get; set; }
        /// <summary>
        /// OBS推流地址
        /// </summary>
        public string OBS_PushUrl { get; set; }
        /// <summary>
        /// OBS推流名称
        /// </summary>
        public string OBS_PushName { get; set; }
        /// <summary> 
        /// 播放房间URL
        /// </summary> 
        public string PlayRoomUrl { get; set; }
        /// <summary> 
        /// 助理房间URL
        /// </summary> 
        public string AassistantRoomUrl { get; set; }
        /// <summary> 
        /// 主进房间URL
        /// </summary> 
        public string SpeakerRoomUrl { get; set; }
        /// <summary> 
        /// 嘉宾房间URL
        /// </summary> 
        public string GuestRoomUrl { get; set; }
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
        /// 活动UID
        /// </summary>
        public string ActivityUID { get; set; }
    }
}
