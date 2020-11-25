using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity
{
    /// <summary>
    /// 文件记录
    /// </summary>
    [TableProperty(Name = "t_FileRecord", PrimaryKey = "FileId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class FileRecord : EntityModel, IEntity
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
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }
    }
}
