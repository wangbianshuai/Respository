using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Transactions;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 用户条件类型
    /// </summary>
    public class UserConditionType : IUserConditionType
    {
        public Data.IUserConditionType _UserConditionType { get; set; }

        public Data.IConditionItem _ConditionItem { get; set; }

        public Data.IDataSource _DataSource { get; set; }

        public Data.IDataSourceItem _DataSourceItem { get; set; }

        public Data.IUserConditionSelectValue _UserConditionSelectValue { get; set; }

        /// <summary>
        /// 以用户Id和选择类型获取用户条件类型列表
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="selectType"></param>
        /// <returns></returns>
        public List<Entity.Domain.ViewUserConditionType> GetUserConditionTypeList(Guid userId, byte selectType)
        {
            var userTypeList = Parse.IEntityDataListTo<Entity.Domain.ViewUserConditionType>(_UserConditionType.GetViewUserConditionTypeList(userId, selectType));

            var typeList = Parse.IEntityDataListTo<Entity.Domain.ConditionType>(_UserConditionType.GetViewConditionTypeList());

            var noUserTypeList = typeList.Except((from a in userTypeList
                                                  from b in typeList
                                                  where a.ConditionTypeId == b.ConditionTypeId
                                                  select b));
            foreach (var c in noUserTypeList)
            {
                userTypeList.Add(new Entity.Domain.ViewUserConditionType()
                {
                    ConditionTypeId = c.ConditionTypeId,
                    ConditionTypeName = c.Name,
                    ManItemCount = c.ManItemCount,
                    WomanItemCount = c.WomanItemCount,
                    SelectType = selectType,
                    UserId = userId
                });
            }

            return userTypeList;
        }

        /// <summary>
        /// 以用户条件类型Id获取用户条件类型
        /// </summary>
        /// <param name="conditionTypeId"></param>
        /// <param name="userConditionTypeId"></param>
        /// <param name="sex"></param>
        /// <param name="selectType"></param>
        /// <returns></returns>
        public Entity.Domain.UserConditionType GetUserConditionTypeById(Guid conditionTypeId, Guid userConditionTypeId, byte sex, byte selectType)
        {
            Entity.Domain.UserConditionType entity = null;
            if (userConditionTypeId != Guid.Empty)
            {
                entity = Parse.IEntityDataTo<Entity.Domain.UserConditionType>(_UserConditionType.GetEntityDataById(userConditionTypeId));
                if (entity == null) return null;
            }
            if (entity == null)
            {
                entity = new Entity.Domain.UserConditionType()
                {
                    ConditionTypeId = conditionTypeId,
                    SelectType = selectType
                };
            }

            var itemList = Parse.IEntityDataListTo<Entity.Domain.ConditionItem>(_ConditionItem.GetEnityDataListByConditionTypeId(conditionTypeId, selectType == 1 ? sex : (byte)(sex == 1 ? 2 : 1)));

            if (itemList.Count == 0) return null;

            var dataSourceIds = itemList.Where(s => s.DataSourceId != Guid.Empty).Select(s => s.DataSourceId).Distinct().ToList();

            //1、获取数据源集合

            var dataSourceList = Parse.IEntityDataListTo<Entity.Domain.DataSource>(_DataSource.GetEnityDataListByIds(dataSourceIds));
            dataSourceIds = dataSourceList.Select(s => s.DataSourceId).ToList();

            //2、获取数据源选择集合
            var dataSourceItemList = Parse.IEntityDataListTo<Entity.Domain.DataSourceItem>(_DataSourceItem.GetEnityDataListByDataSourceIds(dataSourceIds));

            var groupby = dataSourceItemList.GroupBy(g => g.DataSourceId);

            var list = (from a in itemList
                        from b in groupby
                        where a.DataSourceId == b.Key
                        select new { a, b });

            foreach (var c in list)
            {
                c.a.DataSourceItems = c.b.OrderBy(b => b.Value).ToList();
            }

            //3、获取用户选择值
            if (userConditionTypeId != Guid.Empty)
            {
                var selectValueList = Parse.IEntityDataListTo<Entity.Domain.UserConditionSelectValue>(_UserConditionSelectValue.GetEntityDataList(userConditionTypeId));
                var list2 = (from a in itemList
                             from b in selectValueList
                             where a.ItemId == b.ConditionItemId
                             select new { a, b });

                foreach (var c in list2)
                {
                    c.a.Value = c.b.Value;
                }
            }

            //4、赋值
            entity.Items = itemList.OrderBy(b => b.DisplayIndex).ToList();

            return entity;
        }

        bool InsertUserConditionType(Entity.Domain.UserConditionType entity)
        {
            IEntityData entityData = new EntityData("UserConditionTYpe");

            entityData.SetValue("UserConditionTypeId", entity.UserConditionTypeId);
            entityData.SetValue("UserId", entity.UserId);
            entityData.SetValue("SelectType", entity.SelectType);
            entityData.SetValue("ConditionTypeId", entity.ConditionTypeId);
            entityData.SetValue("IsPublic", entity.IsPublic);
            entityData.SetValue("CreateUser", entity.UserId);

            return _UserConditionType.Insert(entityData) != Guid.Empty;
        }

        bool UpdateUserConditionType(Entity.Domain.UserConditionType entity)
        {
            IEntityData entityData = new EntityData("UserConditionTYpe");

            entityData.SetValue("UserConditionTypeId", entity.UserConditionTypeId);
            entityData.SetValue("IsPublic", entity.IsPublic);
            entityData.SetValue("UpdateUser", entity.UserId);
            entityData.SetValue("UpdateDate", DateTime.Now);

            return _UserConditionType.Update(entityData);
        }

        bool InsertUserConditionSelectValue(Entity.Domain.ConditionItem item, Entity.Domain.UserConditionType entity)
        {
            IEntityData entityData = new EntityData("UserConditionSelectValue");

            entityData.SetValue("UserConditionTypeId", entity.UserConditionTypeId);
            entityData.SetValue("ConditionItemId", item.ItemId);
            entityData.SetValue("Value", item.Value);

            return _UserConditionSelectValue.Insert(entityData) != Guid.Empty;
        }

        /// <summary>
        /// 保存用户条件类型
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool SaveUserConditionType(Entity.Domain.UserConditionType entity)
        {
            bool blSucceed = true;

            if (entity.UserConditionTypeId != Guid.Empty)
            {
                var entityData = _UserConditionType.GetEntityDataById(entity.UserConditionTypeId);
                if (entityData == null) return false;
            }

            using (TransactionScope scope = new TransactionScope())
            {
                try
                {
                    if (entity.UserConditionTypeId != Guid.Empty)
                    {
                        blSucceed = _UserConditionSelectValue.DeleteByUserConditionTypeId(entity.UserConditionTypeId);

                        if (blSucceed) blSucceed = UpdateUserConditionType(entity);
                    }
                    else
                    {
                        entity.UserConditionTypeId = Guid.NewGuid();

                        blSucceed = InsertUserConditionType(entity);
                    }

                    foreach (var item in entity.Items)
                    {
                        if (!InsertUserConditionSelectValue(item, entity))
                        {
                            blSucceed = false;
                            break;
                        }
                    }

                    if (blSucceed) scope.Complete();
                    else scope.Dispose();
                }
                catch (Exception ex)
                {
                    scope.Dispose();
                    throw ex;
                }
            }

            return blSucceed;
        }

        /// <summary>
        /// 获取条件型
        /// </summary>
        /// <returns></returns>
        public List<Entity.Domain.UserConditionType> GetUserConditionTypes()
        {
            List<IEntityData> entityDataList = _UserConditionType.GetUserConditionTypes();

            var groupby = entityDataList.GroupBy(b => new { CondtionTypeId = b.GetValue<Guid>("ConditionTypeId"), UserId = b.GetValue<Guid>("UserId") });

            List<Entity.Domain.UserConditionType> userConditionTypeList = new List<Entity.Domain.UserConditionType>();

            Entity.Domain.UserConditionType userConditionType = null;
            foreach (var a in groupby)
            {
                List<IEntityData> list = a.ToList();
                IEntityData data = list[0];

                userConditionType = new Entity.Domain.UserConditionType();

                userConditionType.ConditionTypeId = data.GetValue<Guid>("ConditionTypeId");
                userConditionType.ConditionTypeName = data.GetStringValue("ConditionTypeName");
                userConditionType.UserId = data.GetValue<Guid>("UserId");

                userConditionType.UserSelectItems1 = new List<Entity.Domain.UserConditionSelectValue>();
                userConditionType.UserSelectItems2 = new List<Entity.Domain.UserConditionSelectValue>();

                foreach(var c in list)
                {
                    byte selectType = c.GetValue<byte>("SelectType");
                    if (selectType == 1) userConditionType.UserSelectItems1.Add(GetSelectItem(c));
                    else if (selectType == 2) userConditionType.UserSelectItems2.Add(GetSelectItem(c));
                }

                userConditionTypeList.Add(userConditionType);
            }

            return userConditionTypeList;
        }

        Entity.Domain.UserConditionSelectValue GetSelectItem(IEntityData c)
        {
            return new Entity.Domain.UserConditionSelectValue()
            {
                ItemId = c.GetValue<Guid>("ItemId"),
                Title = c.GetStringValue("Title"),
                Value = c.GetStringValue("Value"),
                DataSourceId = c.GetValue<Guid>("DataSourceId"),
                DataType = c.GetStringValue("DataType"),
                DisplayIndex = c.GetValue<int>("DisplayIndex"),
                IsInterval = c.GetValue<byte>("IsInterval"),
                IsSingle = c.GetValue<byte>("IsSingle"),
                Sex = c.GetValue<byte>("Sex")
            };
        }
    }
}
