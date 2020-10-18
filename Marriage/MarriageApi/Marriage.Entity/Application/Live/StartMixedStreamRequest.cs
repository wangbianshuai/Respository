using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{
    /// <summary>
    /// 启动云端混流请求
    /// </summary>
    public class StartMixedStreamRequest : Request, IRequest
    {
        /// <summary> 
        /// 直播ID
        /// </summary> 
        public Guid LiveId { get; set; }
        /// <summary>
        /// MCU混流布局参数
        /// </summary>
        public LayoutParams LayoutParams { get; set; }
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
    /// 启动云端混流响应
    /// </summary>
    public class StartMixedStreamResponse : Response, IResponse
    {
    }
}
