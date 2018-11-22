using OpenDataAccess.Data;
using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Component
{
    public class DealingsBook : EntityRequest
    {
        EntityType _DealingsBookUser { get; set; }

        public DealingsBook()
        {
        }

        public DealingsBook(Request request)
            : base(request)
        {
            _DealingsBookUser = EntityType.GetEntityType<Entity.DealingsBookUser>();
        }

        [Log]
        public object Delete2()
        {
             List<DeleteRelationEntity> relationList = new List<DeleteRelationEntity>()
            {
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.DealingsBill>(),"此往来账本存在被引用，不能删除，请先取消业务往来引用！", "DataId"),
               new DeleteRelationEntity(EntityType.GetEntityType<Entity.Factory>(),"此往来账本存在被引用，不能删除，请先取消工厂引用！", "DealingsBookId")    
            };
             return CommonOperation.DeleteByLogic<DealingsBook>(this, relationList);
        }

        [Log]
        public object Insert2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            List<Dictionary<string, object>> userList = GetUserList(entityData);

            if (userList.Select(s => s["UserId"]).Distinct().Count() != userList.Count) return GetMessageDict("甲方与乙方不能有相同记账人！");

            entityData.SetValue("Users", userList);

            return EntityByComplexTypeOperation.Insert<DealingsBook>(this, _DealingsBookUser, "Users");
        }

        List<Dictionary<string, object>> GetUserList(IEntityData entityData)
        {
            var bookUsers = entityData.GetValue("BookUsers1");

            List<Dictionary<string, object>> userList = new List<Dictionary<string, object>>();
            Dictionary<string, object> dict = null;

            if (bookUsers != null && bookUsers is List<object>)
            {
                (bookUsers as List<object>).ForEach(b =>
                {
                    dict = new Dictionary<string, object>();
                    dict.Add("UserId", b);
                    dict.Add("UserType", 1);
                    userList.Add(dict);
                });
            }

            bookUsers = entityData.GetValue("BookUsers2");

            if (bookUsers != null && bookUsers is List<object>)
            {
                (bookUsers as List<object>).ForEach(b =>
                {
                    dict = new Dictionary<string, object>();
                    dict.Add("UserId", b);
                    dict.Add("UserType", 2);
                    userList.Add(dict);
                });
            }

            return userList;
        }

        [Log]
        public object Update2()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            List<Dictionary<string, object>> userList = GetUserList(entityData);

            if (userList.Select(s => s["UserId"]).Distinct().Count() != userList.Count) return GetMessageDict("甲方与乙方不能有相同记账人！");

            entityData.SetValue("Users", userList);

            return EntityByComplexTypeOperation.Update<DealingsBook>(this, _DealingsBookUser, "Users");
        }

        List<Guid> GetBookUserList(object obj, byte userType)
        {
            List<IEntityData> list = obj as List<IEntityData>;
            if (list != null)
            {
                return (from a in list
                        where a.GetValue<byte>("UserType") == userType
                        select a.GetValue<Guid>("UserId")).ToList();
            }

            return new List<Guid>();
        }

        public object GetDealingsBook()
        {
            IEntityData entityData = EntityByComplexTypeOperation.GetEntityData<DealingsBook>(this,_DealingsBookUser,"Users") as IEntityData;

            if (entityData != null)
            {
                entityData.SetValue("BookUsers1", GetBookUserList(entityData.GetValue("Users"), 1));
                entityData.SetValue("BookUsers2", GetBookUserList(entityData.GetValue("Users"), 2));
                entityData.Remove("Users");
            }

            return entityData;
        }

    }
}
