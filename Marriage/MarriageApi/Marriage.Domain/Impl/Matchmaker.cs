using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 红娘
    /// </summary>
    public class Matchmaker : IMatchmaker
    {
        public Data.IMatchmaker _Matchmaker { get; set; }

        /// <summary>
        /// 以OpenId获取红娘信息
        /// </summary>
        /// <param name="openId"></param>
        /// <returns></returns>
        public Entity.Domain.Matchmaker GetMatchmakerByOpenId(string openId)
        {
            return Parse.IEntityDataTo<Entity.Domain.Matchmaker>(_Matchmaker.GetEntityDataByOpenId(openId));
        }

        /// <summary>
        /// 创建红娘
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public Guid CreateMatchmaker(Entity.Domain.Matchmaker entity)
        {
            IEntityData entityData = new EntityData("Matchmaker");

            entityData.SetValue("Address", entity.Address);
            entityData.SetValue("City", entity.City);
            entityData.SetValue("HeadImgUrl", entity.HeadImgUrl);
            entityData.SetValue("IdCard", entity.IdCard);
            entityData.SetValue("Features", entity.Features);
            entityData.SetValue("Name", entity.Name);
            entityData.SetValue("NickName", entity.NickName);
            entityData.SetValue("OpenId", entity.OpenId);
            entityData.SetValue("Phone", entity.Phone);
            entityData.SetValue("Province", entity.Province);
            entityData.SetValue("Remark", entity.Remark);
            entityData.SetValue("Sex", entity.Sex);
            entityData.SetValue("MatchmakerId", entity.MatchmakerId);
            entityData.SetValue("CreateUser", entity.MatchmakerId);

            return _Matchmaker.Insert(entityData);
        }

        /// <summary>
        /// 以主键获取红娘信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Entity.Domain.Matchmaker GetMatchmakerById(Guid id)
        {
            return Parse.IEntityDataTo<Entity.Domain.Matchmaker>(_Matchmaker.GetEntityDataById(id));
        }

        /// <summary>
        /// 更新红娘信息
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool UpdateMatchmaker(Entity.Domain.Matchmaker entity)
        {
            IEntityData entityData = new EntityData("Matchmaker");

            entityData.SetValue("Address", entity.Address);
            entityData.SetValue("City", entity.City);
            entityData.SetValue("HeadImgUrl", entity.HeadImgUrl);
            entityData.SetValue("IdCard", entity.IdCard);
            entityData.SetValue("Features", entity.Features);
            entityData.SetValue("Name", entity.Name);
            entityData.SetValue("NickName", entity.NickName);
            entityData.SetValue("Phone", entity.Phone);
            entityData.SetValue("Province", entity.Province);
            entityData.SetValue("Remark", entity.Remark);
            entityData.SetValue("Sex", entity.Sex);
            entityData.SetValue("MatchmakerId", entity.MatchmakerId);
            entityData.SetValue("UpdateUser", entity.MatchmakerId);
            entityData.SetValue("UpdateDate", DateTime.Now);

            return _Matchmaker.Update(entityData);
        }
    }
}
