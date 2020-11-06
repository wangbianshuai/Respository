using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 相亲人员
    /// </summary>
    public class MarriageUser : IMarriageUser
    {
        public Data.IMarriageUser _MarriageUser { get; set; }

        /// <summary>
        /// 以OpenId获取用户信息
        /// </summary>
        /// <param name="openId"></param>
        /// <returns></returns>
        public Entity.Domain.MarriageUser GetUserByOpenId(string openId)
        {
            return Parse.IEntityDataTo<Entity.Domain.MarriageUser>(_MarriageUser.GetEntityDataByOpenId(openId));
        }

        /// <summary>
        /// 创建相亲人员
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public Guid CreateMarriageUser(Entity.Domain.MarriageUser entity)
        {
            IEntityData entityData = new EntityData("MarriageUser");

            entityData.SetValue("Address", entity.Address);
            entityData.SetValue("Birthday", entity.Birthday);
            entityData.SetValue("BirthEight", entity.BirthEight);
            entityData.SetValue("BirthTime", entity.BirthTime);
            entityData.SetValue("City", entity.City);
            entityData.SetValue("HeadImgUrl", entity.HeadImgUrl);
            entityData.SetValue("IdCard", entity.IdCard);
            entityData.SetValue("IsPublic", entity.IsPublic);
            entityData.SetValue("LunarBirthday", entity.LunarBirthday);
            entityData.SetValue("MatchmakerId", entity.MatchmakerId);
            entityData.SetValue("Name", entity.Name);
            entityData.SetValue("NickName", entity.NickName);
            entityData.SetValue("NowAddress", entity.NowAddress);
            entityData.SetValue("OpenId", entity.OpenId);
            entityData.SetValue("Phone", entity.Phone);
            entityData.SetValue("Province", entity.Province);
            entityData.SetValue("Remark", entity.Remark);
            entityData.SetValue("Sex", entity.Sex);
            entityData.SetValue("UserId", entity.UserId);
            entityData.SetValue("CreateUser", entity.UserId);

            return _MarriageUser.Insert(entityData);
        }

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Entity.Domain.MarriageUser GetUserInfoById(Guid id)
        {
            return Parse.IEntityDataTo<Entity.Domain.MarriageUser>(_MarriageUser.GetEntityDataById(id));
        }
    }
}
