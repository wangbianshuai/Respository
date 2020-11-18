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

        /// <summary>
        /// 获取红娘下用户生活照列表
        /// </summary>
        GetUserPhotoByMatchmakerResponse GetUserPhotoByMatchmaker(GetUserPhotoByMatchmakerRequest request);

        /// <summary>
        /// 获取用户下用户生活照列表
        /// </summary>
        /// <param name="request"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        GetUserPhotoByUserResponse GetUserPhotoByUser(GetUserPhotoByUserRequest request);
    }
}
