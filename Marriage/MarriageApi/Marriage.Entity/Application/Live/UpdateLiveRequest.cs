using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{
    /// <summary>
    /// 更新直播请求
    /// </summary>
    public class UpdateLiveRequest : Request, IRequest
    {
        /// <summary> 
        /// 直播ID
        /// </summary> 
        public Guid LiveId { get; set; }
        /// <summary> 
        /// 名称（必填）
        /// </summary> 
        public string Name { get; set; }
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
    }

    /// <summary>
    /// 更新直播响应
    /// </summary>
    public class UpdateLiveResponse : Response, IResponse
    {
        /// <summary>
        /// 直播数据
        /// </summary>
        public LiveData Data { get; set; }
    }
}
