using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Transactions;

namespace Marriage.Component
{
    public class User : EntityRequest
    {
        EntityType _UserUserTagEntity { get; set; }

        public User()
        {
        }

        public User(Request request)
            : base(request)
        {
            _UserUserTagEntity = EntityType.GetEntityType<Entity.UserUserTag>();
        }

        public object SetUserTag()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            List<string> openIdList = entityData.GetValue<List<string>>("OpenIds");
            Guid userTagId = entityData.GetValue<Guid>("UserTagId");

            List<IEntityData> userUserTagList = GetUserUserTagList(openIdList, userTagId);

            openIdList = openIdList.Except(userUserTagList.Select(s => s.GetValue<string>("OpenId"))).ToList();

            if (openIdList.Count == 0) return GetMessageDict("所选粉丝都已标记此标签！");

            using (TransactionScope transaction = new TransactionScope())
            {
                foreach (var openId in openIdList)
                {
                    if (!AddUserTag(openId, userTagId))
                    {
                        transaction.Dispose();
                        break;
                    }
                }

                transaction.Complete();
            }
            return GetBoolDict(true);
        }

        bool AddUserTag(string openId, Guid userTagId)
        {
            IEntityData entityData = new EntityData(_UserUserTagEntity);
            entityData.SetValue("OpenId", openId);
            entityData.SetValue("UserTagId", userTagId);

            return this.InsertEntity(_UserUserTagEntity, entityData, out _);
        }

        List<IEntityData> GetUserUserTagList(List<string> openIdList, Guid userTagId)
        {
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@UserTagId", userTagId));

            List<string> inParameterList = new List<string>();
            openIdList.ToList().ForEach(id =>
            {
                var parameterName = "@P" + Guid.NewGuid().ToString().Substring(0, 8).ToString();
                parameterList.Add(this.InParameter(parameterName, id));
                inParameterList.Add(parameterName);
            });

            IQuery query = new Query(_UserUserTagEntity.TableName);
            query.Where(string.Format("where OpenId in ({0}) and UserTagId=@UserTagId", string.Join(",", inParameterList)), parameterList);

            return this.SelectEntities(query);
        }

        bool DeleteUserUserTagList(List<string> openIdList, List<Guid> userTagIdList)
        {
            string userTagIds = string.Join(",", userTagIdList.Select(s => string.Format("'{0}'", s)));

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            List<string> inParameterList = new List<string>();
            openIdList.ToList().ForEach(id =>
            {
                var parameterName = "@P" + Guid.NewGuid().ToString().Substring(0, 8).ToString();
                parameterList.Add(this.InParameter(parameterName, id));
                inParameterList.Add(parameterName);
            });


            IQuery query = new Query(_UserUserTagEntity.TableName);
            query.Where(string.Format("where OpenId in ({0}) and UserTagId in ({1})", string.Join(",", inParameterList), userTagIds), parameterList);

            return this.DeleteEntity(this._UserUserTagEntity, query);
        }

        public object CancelUserTag()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            List<string> openIdList = entityData.GetValue<List<string>>("OpenIds");
            List<Guid> userTagIdList = entityData.GetValue<List<string>>("UserTagIds").Select(s => new Guid(s)).ToList();

            return GetBoolDict(DeleteUserUserTagList(openIdList, userTagIdList));
        }
    }
}
