using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.Live
{
    /// <summary>
    /// 云点播编辑视频回调请求
    /// </summary>
    public class EditMediaCallbackRequest : Request, IRequest
    {
        /// <summary>
        /// 事件类型
        /// </summary>
        public string EventType { get; set; }

        /// <summary>
        /// 编辑视频完成事件
        /// </summary>
        public EditMediaTask EditMediaCompleteEvent { get; set; }
    }

    /// <summary>
    /// 编辑视频任务
    /// </summary>
    public class EditMediaTask
    {
        /// <summary>
        /// 任务 ID。
        /// </summary>
        public string TaskId { get; set; }
        /// <summary>
        /// 任务流状态，取值： PROCESSING：处理中；FINISH：已完成。
        /// </summary>
        public string Status { get; set; }
        /// <summary>
        /// 错误码，0 表示成功，其他值表示失败：
        /// 0000：输入参数不合法，请检查输入参数；
        ///60000：源文件错误（如视频数据损坏），请确认源文件是否正常；
        ///70000：内部服务错误，建议重试。
        /// </summary>
        public int ErrCode { get; set; }
        /// <summary>
        /// 错误信息
        /// </summary>
        public string Message { get; set; }
        /// <summary>
        ///  视频编辑任务的输入。注意：此字段可能返回 null，表示取不到有效值。
        /// </summary>
        public EditMediaTaskInput Input { get; set; }
        /// <summary>
        /// 视频编辑任务的输出。注意：此字段可能返回 null，表示取不到有效值。
        /// </summary>
        public EditMediaTaskOutput Output { get; set; }
        /// <summary>
        /// 若发起视频编辑任务时指定了视频处理流程，则该字段为流程任务 ID。
        /// </summary>
        public string ProcedureTaskId { get; set; }
        /// <summary>
        /// 来源上下文，用于透传用户请求信息，任务流状态变更回调将返回该字段值，最长 1000 个字符。
        /// </summary>
        public string SessionContext { get; set; }
        /// <summary>
        /// 用于去重的识别码，如果七天内曾有过相同的识别码的请求，则本次的请求会返回错误。最长 50 个字符，不带或者带空字符串表示不做去重。
        /// </summary>
        public string SessionId { get; set; }
    }

    /// <summary>
    /// 编辑视频任务的输入。
    /// </summary>
    public class EditMediaTaskInput
    {
        /// <summary>
        /// 输入视频的来源类型，可以取的值为 File，Stream 两种。
        /// </summary>
        public string InputType { get; set; }
        /// <summary>
        /// 输入的视频文件信息，当 InputType 为 File 时，该字段有值。
        /// </summary>
        public List<EditMediaFileInfo> FileInfoSet { get; set; }
        /// <summary>
        /// 输入的流信息，当 InputType 为 Stream 时，该字段有值。
        /// </summary>
        public List<EditMediaStreamInfo> StreamInfoSet { get; set; }
    }

    /// <summary>
    ///  输入的视频文件信息，当 InputType 为 File 时必填。
    /// </summary>
    public class EditMediaFileInfo
    {
        /// <summary>
        /// 视频的 ID。
        /// </summary>
        public string FileId { get; set; }
        /// <summary>
        /// 视频剪辑的起始偏移时间偏移，单位：秒。
        /// </summary>
        public float? StartTimeOffset { get; set; }
        /// <summary>
        /// 视频剪辑的起始结束时间偏移，单位：秒。
        /// </summary>
        public float? EndTimeOffset { get; set; }
    }

    /// <summary>
    /// 输入的流信息，当 InputType 为 Stream 时必填。
    /// </summary>
    public class EditMediaStreamInfo
    {
        /// <summary>
        /// 录制的流 ID
        /// </summary>
        public string StreamId { get; set; }
        /// <summary>
        /// 流剪辑的起始时间，使用 [ISO 日期格式](https://cloud.tencent.com/document/product/266/11732#I)。
        /// </summary>
        public string StartTime { get; set; }
        /// <summary>
        /// 流剪辑的结束时间，使用 [ISO 日期格式](https://cloud.tencent.com/document/product/266/11732#I)。
        /// </summary>
        public string EndTime { get; set; }
    }

    /// <summary>
    /// 编辑视频任务的输出
    /// </summary>
    public class EditMediaTaskOutput
    {
        /// <summary>
        /// 文件类型，例如 mp4、flv 等。
        /// </summary>
        public string FileType { get; set; }
        /// <summary>
        /// 媒体文件播放地址。
        /// </summary>
        public string FileUrl { get; set; }
        /// <summary>
        /// 媒体文件 ID。
        /// </summary>
        public string FileId { get; set; }
        /// <summary>
        ///  输出文件名，最长 64 个字符。缺省由系统指定生成文件名。
        /// </summary>
        public string MediaName { get; set; }
        /// <summary>
        /// 分类ID，用于对媒体进行分类管理，可通过 创建分类 接口，创建分类，获得分类 ID。默认值：0，表示其他分类。
        /// </summary>
        public int ClassId { get; set; }
        /// <summary>
        /// 输出文件的过期时间，超过该时间文件将被删除，默认为永久不过期，格式按照 ISO 8601标准表示，详见 ISO 日期格式说明。
        /// </summary>
        public string ExpireTime { get; set; }
    }

    /// <summary>
    /// 云点播编辑视频回响应
    /// </summary>
    public class EditMediaCallbackResponse: Response, IResponse
    {

    }
}
