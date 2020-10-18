using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.LiveCloud
{
    /// <summary>
    /// 启动云端混流请求
    /// </summary>
    public class StartMixedStreamRequest : Request, IRequest
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
        /// Region
        /// </summary>
        public string Region { get; set; }

        /// <summary>
        /// 请求参数
        /// </summary>
        public StartMixedStreamRequestParameter RequestParameter { get; set; }
    }

    /// <summary>
    /// 请求参数
    /// </summary>
    public class StartMixedStreamRequestParameter
    {
        /// <summary>
        /// TRTC的SDKAppId。
        /// </summary>
        public int SdkAppId { get; set; }
        /// <summary>
        /// 房间号
        /// </summary>
        public int RoomId { get; set; }
        /// <summary>
        /// 混流输出控制参数
        /// </summary>
        public OutputParams OutputParams { get; set; }
        /// <summary>
        /// 混流输出编码参数
        /// </summary>
        public EncodeParams EncodeParams { get; set; }
        /// <summary>
        /// LayoutParams
        /// </summary>
        public LayoutParams LayoutParams { get; set; }
    }

    /// <summary>
    /// MCU混流的输出参数
    /// </summary>
    public class OutputParams
    {
        /// <summary>
        /// 是 播流 ID，由用户自定义设置，该流 ID 不能与用户旁路的流 ID 相同。
        /// </summary>
        public string StreamId { get; set; }
        /// <summary>
        /// 否 取值范围[0, 1]， 填0：直播流为音视频(默认); 填1：直播流为纯音频
        /// </summary>
        public int PureAudioStream { get; set; }
        /// <summary>
        /// 否 自定义录制文件名
        /// </summary>

        public string RecordId { get; set; }
        /// <summary>
        /// Integer 否   取值范围[0, 1]，填0无实际含义; 填1：指定录制文件格式为mp3
        /// </summary>
        public int RecordAudioOnly { get; set; }
    }

    /// <summary>
    /// MCU混流输出流编码参数
    /// </summary>
    public class EncodeParams
    {
        /// <summary>
        /// 否 混流-输出流宽，音视频输出时必填。取值范围[0, 1920]，单位为像素值。
        /// </summary>
        public int VideoWidth { get; set; }
        /// <summary>
        /// 否 混流-输出流高，音视频输出时必填。取值范围[0, 1080]，单位为像素值。
        /// </summary>
        public int VideoHeight { get; set; }
        /// <summary>
        /// 否 混流-输出流码率，音视频输出时必填。取值范围[1, 10000]，单位为Kbps。
        /// </summary>
        public int VideoBitrate { get; set; }
        /// <summary>
        /// 否 混流-输出流帧率，音视频输出时必填。取值为[6, 12, 15, 24, 30, 48, 60]，不在上述帧率值内系统会自动调整。
        /// </summary>
        public int VideoFramerate { get; set; }
        /// <summary>
        /// 否 混流-输出流gop，音视频输出时必填。取值范围[1, 5]，单位为秒。
        /// </summary>
        public int VideoGop { get; set; }
        /// <summary>
        /// 否 混流-输出流背景色。
        /// </summary>
        public int BackgroundColor { get; set; }
        /// <summary>
        /// 是 混流-输出流音频采样率。取值为[48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000]。
        /// </summary>
        public int AudioSampleRate { get; set; }
        /// <summary>
        /// 是 混流-输出流音频码率。取值范围[8, 500]，单位为Kbps。
        /// </summary>
        public int AudioBitrate { get; set; }
        /// <summary>
        /// 是 混流-输出流音频声道数，取值范围[1, 2]。
        /// </summary>
        public int AudioChannels { get; set; }
        /// <summary>
        /// 否 混流-输出流背景图片，取值为实时音视频控制台上传的图片ID。
        /// </summary>
        public int BackgroundImageId { get; set; }
    }

    /// <summary>
    /// MCU混流布局参数
    /// </summary>
    public class LayoutParams
    {
        /// <summary>
        /// 否	混流布局模板ID，0为悬浮模板(默认);1为九宫格模板;2为屏幕分享模板;3为画中画模板。
        /// </summary>
        public int Template { get; set; }
        /// <summary>
        /// 否	屏幕分享模板、悬浮模板、画中画模板中有效，代表大画面对应的用户ID。
        /// </summary>
        public string MainVideoUserId { get; set; }
        /// <summary>
        /// 否	屏幕分享模板、悬浮模板、画中画模板中有效，代表大画面对应的流类型，0为摄像头，1为屏幕分享。左侧大画面为web用户时此值填0。
        /// </summary>

        public int MainVideoStreamType { get; set; }
        /// <summary>
        /// 否	画中画模板中有效，代表小画面的布局参数。
        /// </summary>

        public SmallVideoLayoutParams SmallVideoLayoutParams { get; set; }
        /// <summary>
        /// 否	屏幕分享模板有效。设置为1时代表大画面居右，小画面居左布局。默认为0。
        /// </summary>

        public int MainVideoRightAlign { get; set; }
    }

    /// <summary>
    /// 画中画模板中有效，代表小画面的布局参数。
    /// </summary>
    public class SmallVideoLayoutParams 
    {
        /// <summary>
        /// 是	代表小画面对应的用户ID。
        /// </summary>
        public string UserId { get; set; }
        /// <summary>
        /// 是	代表小画面对应的流类型，0为摄像头，1为屏幕分享。小画面为web用户时此值填0。
        /// </summary>

        public int StreamType { get; set; }
        /// <summary>
        /// 否	小画面在输出时的宽度，单位为像素值，不填默认为0
        /// </summary>

        public int ImageWidth { get; set; }
        /// <summary>
        /// 否	小画面在输出时的高度，单位为像素值，不填默认为0。
        /// </summary>

        public int ImageHeight { get; set; }
        /// <summary>
        /// 否	小画面在输出时的X偏移，单位为像素值，LocationX与ImageWidth之和不能超过混流输出的总宽度，不填默认为0。
        /// </summary>

        public int LocationX { get; set; }
        /// <summary>
        /// 否	小画面在输出时的Y偏移，单位为像素值，LocationY与ImageHeight之和不能超过混流输出的总高度，不填默认为0
        /// </summary>

        public int LocationY { get; set; }
    }

    /// <summary>
    /// 请求参数
    /// </summary>

    /// <summary>
    /// 启动云端混流响应
    /// </summary>
    public class StartMixedStreamResponse : Response, IResponse
    {
    }
}
