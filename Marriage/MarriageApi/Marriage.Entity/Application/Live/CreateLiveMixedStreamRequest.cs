using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{
    /// <summary>
    /// 创建通用混流请求
    /// </summary>
    public class CreateLiveMixedStreamRequest : Request, IRequest
    {
        /// <summary> 
        /// 直播ID
        /// </summary> 
        public Guid LiveId { get; set; }
        /// <summary>
        /// 混流输入流列表。
        /// </summary>
        public List<CommonMixInputParam> InputStreamList { get; set; }
    }

    /// <summary>
    /// 通用混流输入参数。
    /// </summary>
    public class CommonMixInputParam
    {
        /// <summary>
        /// 是	输入流名称。80字节以内，仅含字母、数字以及下划线的字符串。
        /// </summary>
        public string InputStreamName { get; set; }
        /// <summary>
        /// 是	输入流布局参数。
        /// </summary>
        public CommonMixLayoutParams LayoutParams { get; set; }
    }

    /// <summary>
    /// 输入流布局参数
    /// </summary>
    public class CommonMixLayoutParams
    {
        /// <summary>
        /// 是	输入图层。取值范围[1，16]。 1)背景流（即大主播画面或画布）的 image_layer 填1。 2)纯音频混流，该参数也需填。
        /// </summary>
        public int ImageLayer { get; set; }
        /// <summary>
        /// 否	输入类型。取值范围[0，5]。 不填默认为0。 0表示输入流为音视频。 2表示输入流为图片。 3表示输入流为画布。 4表示输入流为音频。 5表示输入流为纯视频。
        /// </summary>
        public int InputType { get; set; }
        /// <summary>
        /// 否	输入画面在输出时的宽度。取值范围： 像素：[0，2000] 百分比：[0.01，0.99] 不填默认为输入流的宽度。 使用百分比时，期望输出为（百分比 * 背景宽）。
        /// </summary>
        public float ImageWidth { get; set; }
        /// <summary>
        /// 否	输入画面在输出时的高度。取值范围： 像素：[0，2000] 百分比：[0.01，0.99] 不填默认为输入流的高度。 使用百分比时，期望输出为（百分比 * 背景高）。
        /// </summary>
        public float ImageHeight { get; set; }
        /// <summary>
        /// 否	输入在输出画面的X偏移。取值范围： 像素：[0，2000] 百分比：[0.01，0.99] 不填默认为0。 相对于大主播背景画面左上角的横向偏移。 使用百分比时，期望输出为（百分比 * 背景宽）。
        /// </summary>
        public float LocationX { get; set; }
        /// <summary>
        /// 否	输入在输出画面的Y偏移。取值范围： 像素：[0，2000] 百分比：[0.01，0.99] 不填默认为0。 相对于大主播背景画面左上角的纵向偏移。 使用百分比时，期望输出为（百分比 * 背景宽）
        /// </summary>
        public float LocationY { get; set; }
        /// <summary>
        /// 否	当InputType为3(画布)时，该值表示画布的颜色。 常用的颜色有： 红色：0xcc0033。 黄色：0xcc9900。 绿色：0xcccc33。 蓝色：0x99CCFF。 黑色：0x000000。 白色：0xFFFFFF。 灰色：0x999999。
        /// </summary>
        public string Color { get; set; }
        /// <summary>
        /// 否	当InputType为2(图片)时，该值是水印ID。
        /// </summary>
        public int WatermarkId { get; set; }
    }

    /// <summary>
    /// 创建通用混流响应
    /// </summary>
    public class CreateLiveMixedStreamResponse : Response, IResponse
    {

    }
}
