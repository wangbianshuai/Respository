using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.LiveCloud
{
    /// <summary>
    /// 编辑视频请求
    /// </summary>
    public class EditMediaStreamRequest : Request, IRequest
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
        public EditMediaStreamRequestParameter RequestParameter { get; set; }
    }

    /// <summary>
    /// 请求参数
    /// </summary>
    public class EditMediaStreamRequestParameter
    {
        /// <summary>
        /// 输入视频的类型，可以取的值为 File，Stream 两种。
        /// </summary>
        public string InputType { get; set; }
        /// <summary>
        /// 输入的视频文件信息，当 InputType 为 File 时必填。
        /// </summary>
        public List<EditMediaFileInfo> FileInfos { get; set; }
        /// <summary>
        /// 输入的流信息，当 InputType 为 Stream 时必填。
        /// </summary>
        public List<EditMediaStreamInfo> StreamInfos { get; set; }
        /// <summary>
        /// 编辑模板 ID，取值有 10，20，不填代表使用 10 模板。10：拼接时，以分辨率最高的输入为基准；20：拼接时，以码率最高的输入为基准；
        /// </summary>
        public ulong? Definition { get; set; }
        /// <summary>
        /// [任务流模板](/document/product/266/11700#.E4.BB.BB.E5.8A.A1.E6.B5.81.E6.A8.A1.E6.9D.BF)名字，如果要对生成的新视频执行任务流时填写。
        /// </summary>
        public string ProcedureName { get; set; }
        /// <summary>
        /// 编辑后生成的文件配置。
        /// </summary>
        public EditMediaOutputConfig OutputConfig { get; set; }
        /// <summary>
        /// 标识来源上下文，用于透传用户请求信息，在EditMediaComplete回调和任务流状态变更回调将返回该字段值，最长 1000个字符
        /// </summary>
        public string SessionContext { get; set; }
        /// <summary>
        /// 任务的优先级，数值越大优先级越高，取值范围是 -10 到 10，不填代表 0。
        /// </summary>
        public long? TasksPriority { get; set; }
        /// <summary>
        /// 用于任务去重的识别码，如果一天内曾有过相同的识别码的请求，则本次的请求会返回错误。最长 50 个字符，不带或者带空字符串表示不做去重
        /// </summary>
        public string SessionId { get; set; }
        /// <summary>
        /// 点播[子应用](/document/product/266/14574) ID。如果要访问子应用中的资源，则将该字段填写为子应用 ID；否则无需填写该字段。
        /// </summary>
        public ulong? SubAppId { get; set; }
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
    /// 编辑后生成的文件配置
    /// </summary>
    public class EditMediaOutputConfig
    {
        /// <summary>
        /// 输出文件名，最长 64 个字符。缺省由系统指定生成文件名。
        /// </summary>
        public string MediaName { get; set; }
        /// <summary>
        /// 出文件格式，可选值：mp4、hls。默认是 mp4。
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// 分类ID，用于对媒体进行分类管理，可通过 [创建分类](/document/product/266/7812) 接口，创建分类，获得分类 ID。默认值：0，表示其他分类。
        /// </summary>
        public long? ClassId { get; set; }
        /// <summary>
        /// 输出文件的过期时间，超过该时间文件将被删除，默认为永久不过期，格式按照 ISO 8601标准表示，详见 [ISO 日期格式说明](https://cloud.tencent.com/document/product/266/11732#I)。
        /// </summary>
        public string ExpireTime { get; set; }
    }

    /// <summary>
    /// 编辑视频响应
    /// </summary>
    public class EditMediaStreamResponse : Response, IResponse
    {
        /// <summary>
        /// 任务Id
        /// </summary>
        public string TaskId { get; set; }
    }
}
