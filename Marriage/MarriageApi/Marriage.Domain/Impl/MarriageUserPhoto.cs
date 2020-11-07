using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 相亲人员照片
    /// </summary>
    public class MarriageUserPhoto : IMarriageUserPhoto
    {
        public Data.IMarriageUserPhoto _MarriageUserPhoto { get; set; }

        /// <summary>
        /// 以用户Id获取照片列表
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<Entity.Domain.MarriageUserPhoto> GetUserPhotos(Guid userId)
        {
            return Parse.IEntityDataListTo<Entity.Domain.MarriageUserPhoto>(_MarriageUserPhoto.GetEnityDataListByUserId(userId));
        }

        /// <summary>
        /// 保存用户照片
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="photoUrl"></param>
        /// <returns></returns>
        public Guid SaveUserPhoto(Guid userId, string photoUrl)
        {
            IEntityData entityData = new EntityData("MarriageUserPhoto");

            entityData.SetValue("PhotoUrl", photoUrl);
            entityData.SetValue("MarriageUserId", userId);
            entityData.SetValue("CreateUser", userId);

            return _MarriageUserPhoto.Insert(entityData);
        }
    }
}
