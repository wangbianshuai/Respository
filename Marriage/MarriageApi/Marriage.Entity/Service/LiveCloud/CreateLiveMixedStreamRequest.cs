using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.LiveCloud
{
    /// <summary>
    /// 创建通用混流请求
    /// </summary>
    public class CreateLiveMixedStreamRequest : Request, IRequest
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
        public CreateCommonMixStreamRequestParameter RequestParameter { get; set; }
    }

    /// <summary>
    /// 请求参数
    /// </summary>
    public class CreateCommonMixStreamRequestParameter
    {
        /// <summary>
        /// 混流会话（申请混流开始到取消混流结束）标识 ID。
        /// </summary>
        public string MixStreamSessionId { get; set; }
        /// <summary>
        /// 混流输入流列表。
        /// </summary>
        public List<CommonMixInputParam> InputStreamList { get; set; }
        /// <summary>
        /// 混流输出流参数。
        /// </summary>
        public CommonMixOutputParams OutputParams { get; set; }
        /// <summary>
        /// 否 输入模板 ID，若设置该参数，将按默认模板布局输出，无需填入自定义位置参数。 
        /// 不填默认为0。 两输入源支持10，20，30，40，50。 三输入源支持310，390，391。 四输入源支持410。 五输入源支持510，590。 六输入源支持610。
        /// </summary>
        public int MixStreamTemplateId { get; set; }
        /// <summary>
        /// 否 混流的特殊控制参数。如无特殊需求，无需填写。
        /// </summary>
        public CommonMixControlParams ControlParams { get; set; }
    }

    /// <summary>
    /// 混流的特殊控制参数。如无特殊需求，无需填写。
    /// </summary>
    public class CommonMixControlParams
    {
        /// <summary>
        /// 否 取值范围[0, 1]。 填1时，当参数中图层分辨率参数与视频实际分辨率不一致时，自动从视频中按图层设置的分辨率比例进行裁剪。
        /// </summary>
        public int UseMixCropCenter { get; set; }
        /// <summary>
        /// 否 取值范围[0, 1] 填1时，当InputStreamList中个数为1时，且OutputParams.OutputStreamType为1时，不执行取消操作，执行拷贝流操作
        /// </summary>
        public int AllowCopy { get; set; }
    }

    /// <summary>
    /// 混流输出流参数
    /// </summary>
    public class CommonMixOutputParams
    {
        /// <summary>
        /// 是 输出流名称。
        /// </summary>
        public string OutputStreamName { get; set; }
        /// <summary>
        /// 否 输出流类型，取值范围[0, 1]。 不填默认为0。 当输出流为输入流 list 中的一条时，填写0。 当期望生成的混流结果成为一条新流时，该值填为1。 
        /// 该值为1时，output_stream_id 不能出现在 input_stram_list 中，且直播后台中，不能存在相同 ID 的流。
        /// </summary>
        public int? OutputStreamType { get; set; }
        /// <summary>
        /// 否 输出流比特率。取值范围[1，50000]。 不填的情况下，系统会自动判断。
        /// </summary>
        public int? OutputStreamBitRate { get; set; }
        /// <summary>
        /// 否 输出流GOP大小。取值范围[1, 10]。 不填的情况下，系统会自动判断。
        /// </summary>
        public int? OutputStreamGop { get; set; }
        /// <summary>
        /// 否 输出流帧率大小。取值范围[1, 60]。 不填的情况下，系统会自动判断。
        /// </summary>
        public int? OutputStreamFrameRate { get; set; }
        /// <summary>
        /// 否 输出流音频比特率。取值范围[1, 500] 不填的情况下，系统会自动判断。
        /// </summary>
        public int? OutputAudioBitRate { get; set; }
        /// <summary>
        /// 否 输出流音频采样率。取值范围[96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000]。 不填的情况下，系统会自动判断。
        /// </summary>
        public int? OutputAudioSampleRate { get; set; }
        /// <summary>
        /// 否 输出流音频声道数。取值范围[1, 2]。 不填的情况下，系统会自动判断。
        /// </summary>
        public int? OutputAudioChannels { get; set; }
        /// <summary>
        /// 否 输出流中的sei信息。如果无特殊需要，不填。
        /// </summary>
        public string MixSei { get; set; }
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
        /// <summary>
        /// 否	输入流裁剪参数。
        /// </summary>
        public CommonMixCropParams CropParams { get; set; }
    }

    /// <summary>
    /// 输入流裁剪参数。
    /// </summary>
    public class CommonMixCropParams
    {
        /// <summary>
        /// 否 裁剪的宽度。取值范围[0，2000]。
        /// </summary>
        public float CropWidth { get; set; }
        /// <summary>
        /// 否 裁剪的高度。取值范围[0，2000]。
        /// </summary>
        public float CropHeight { get; set; }
        /// <summary>
        /// 否 裁剪的起始X坐标。取值范围[0，2000]。
        /// </summary>
        public float CropStartLocationX { get; set; }
        /// <summary>
        /// 否 裁剪的起始Y坐标。取值范围[0，2000]。
        /// </summary>
        public float CropStartLocationY { get; set; }
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
    public class CreateLiveMixedStreamResponse:Response, IResponse
    {

    }
}
