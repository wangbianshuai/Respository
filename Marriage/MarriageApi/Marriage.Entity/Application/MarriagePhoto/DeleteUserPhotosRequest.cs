using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUserPhoto
{
    /// <summary>
    /// 删除用户照片请求
    /// </summary>
    public class DeleteUserPhotosRequest : Request, IRequest
    {
        /// <summary>
        /// 照片主键集合
        /// </summary>
        public List<Guid> PhotoIds { get; set; }
    }

    /// <summary>
    /// 删除用户照片响应
    /// </summary>
    public class DeleteUserPhotosResponse : Response, IResponse
    {
    }
}
