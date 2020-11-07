using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    /// 相亲人员相册
    /// </summary>
    public interface IMarriageUserPhoto
    {
        /// <summary>
        /// 以用户Id获取照片列表
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        List<Entity.Domain.MarriageUserPhoto> GetUserPhotos(Guid userId);

        /// <summary>
        /// 保存用户照片
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="photoUrl"></param>
        /// <returns></returns>
        Guid SaveUserPhoto(Guid userId, string photoUrl);
    }
}
