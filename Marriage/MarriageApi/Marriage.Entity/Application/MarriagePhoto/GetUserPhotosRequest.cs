using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUserPhoto
{
    /// <summary>
    /// 获取用户生活照列表请求
    /// </summary>
    public class GetUserPhotosRequest : Request, IRequest
    {
    }

    /// <summary>
    /// 获取用户生活照列表响应
    /// </summary>
    public class GetUserPhotosResponse : Response, IResponse
    {
        /// <summary>
        /// 用户照片
        /// </summary>
        public List<UserPhoto> DataList { get; set; }
    }

    /// <summary>
    /// 用户照片
    /// </summary>
    public class UserPhoto
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid PhotoId { get; set; }
        /// <summary> 
        /// 照片地址
        /// </summary> 
        public string PhotoUrl { get; set; }
    }
}
