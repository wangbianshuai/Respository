using Marriage.Entity.Application.MarriageUserPhoto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application
{
    /// <summary>
    /// 相亲照片
    /// </summary>
    public interface IMarriageUserPhoto
    {
        /// <summary>
        /// 获取用户生活照列表
        /// </summary>
        GetUserPhotosResponse GetUserPhotos(GetUserPhotosRequest request);

        /// <summary>
        /// 保存用户照片
        /// </summary>
        SaveUserPhotoResponse SaveUserPhoto(SaveUserPhotoRequest request);

        /// <summary>
        /// 删除用户照片
        /// </summary>
        DeleteUserPhotosResponse DeleteUserPhotos(DeleteUserPhotosRequest request);
    }
}
