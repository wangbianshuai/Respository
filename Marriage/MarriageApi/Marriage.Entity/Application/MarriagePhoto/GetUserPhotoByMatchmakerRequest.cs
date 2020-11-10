using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Application.MarriageUserPhoto
{
    /// <summary>
    /// 获取红娘下用户生活照列表请求
    /// </summary>
    public class GetUserPhotoByMatchmakerRequest : Request, IRequest
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }
    }

    /// <summary>
    /// 获取红娘下用户生活照列表响应
    /// </summary>
    public class GetUserPhotoByMatchmakerResponse : Response, IResponse
    {
        /// <summary>
        /// 用户照片
        /// </summary>
        public List<UserPhoto> DataList { get; set; }
    }
}
