using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

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

            var itemList = Parse.IEntityDataListTo<Entity.Domain.ConditionItem>(_ConditionItem.GetEnityDataListByConditionTypeIds(conditionTypeId, sex));

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
                c.a.DataSourceItems = c.b.ToList();
            }

            //3、获取用户选择值
            if (userConditionTypeId != Guid.Empty)
            {
                var selectValueList = Parse.IEntityDataListTo<Entity.Domain.ConditionSelectValue>(_UserConditionSelectValue.GetEntityDataList(userConditionTypeId));
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
    }
}
