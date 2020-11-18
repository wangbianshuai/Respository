using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUserPhoto
{
    /// <summary>
    /// 获取用户下用户生活照列表请求
    /// </summary>
    public class GetUserPhotoByUserRequest : Request, IRequest
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }
        /// <summary>
        /// 类型，1：相亲广场用户，2：相亲安排用户
        /// </summary>
        public byte Type { get; set; }
    }

    /// <summary>
    /// 获取用户下用户生活照列表响应
    /// </summary>
    public class GetUserPhotoByUserResponse : Response, IResponse
    {
        /// <summary>
        /// 用户照片
        /// </summary>
        public List<UserPhoto> DataList { get; set; }
    }
}
