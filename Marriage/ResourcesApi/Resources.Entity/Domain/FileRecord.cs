using System;
using System.Collections.Generic;
using System.Text;

namespace Resources.Entity.Domain
{
    /// <summary>
    /// 文件记录
    /// </summary>
    public class FileRecord
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid FileId { get; set; }
        /// <summary> 
        /// AppId
        /// </summary> 
        public string AppId { get; set; }
        /// <summary> 
        /// 文件路径
        /// </summary> 
        public string FilePath { get; set; }
        /// <summary> 
        /// 文件名
        /// </summary> 
        public string FileName { get; set; }
        /// <summary> 
        /// 文件类型
        /// </summary> 
        public string FileType { get; set; }
        /// <summary> 
        /// 文件大小(字节B)
        /// </summary> 
        public long FileSize { get; set; }
        /// <summary>
        /// IP地址
        /// </summary>
        public string IpAddress { get; set; }
    }
}
