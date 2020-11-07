using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUserPhoto
{
    /// <summary>
    /// 保存用户照片请求
    /// </summary>
    public class SaveUserPhotoRequest : Request, IRequest
    {
        /// <summary>
        /// 照片地址
        /// </summary>
        public string PhotoUrl { get; set; }
    }

    /// <summary>
    /// 保存用户照片响应
    /// </summary>
    public class SaveUserPhotoResponse : Response, IResponse
    {
        /// <summary>
        /// 主键
        /// </summary>
        public Guid PhotoId { get; set; }
    }

}
