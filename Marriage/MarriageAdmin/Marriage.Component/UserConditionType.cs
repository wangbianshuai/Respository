using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using OpenDataAccessCore.Data;
using System.Data;

namespace Marriage.Component
{
    public class UserConditionType : EntityRequest
    {
        public UserConditionType()
        {
        }

        public UserConditionType(Request request)
            : base(request)
        {
        }

        /// <summary>
        /// 获取用户条件类型
        /// </summary>
        /// <returns></returns>
        [Log]
        public object GetUserConditionType()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            Guid userId = entityData.GetValue<Guid>("UserId");
            byte selectType = entityData.GetValue<byte>("SelectType");

            //1、获取用户条件类型
            List<IEntityData> userConditionTypeList = GetUserConditionType(userId, selectType);

            //2、获取用户条件选择值
            List<IEntityData> userConditionSelectValueList = GetUserConditionSelectValue(userId, selectType);

            List<Guid> dataSourceIdList = userConditionSelectValueList.Where(w => w.GetValue<Guid>("DataSourceId") != Guid.Empty).Select(s => s.GetValue<Guid>("DataSourceId")).ToList();

            //3、获取数据源
            List<IEntityData> datSourceItemList = GetEnityDataListByDataSourceIds(dataSourceIdList);

            var dataSourceGroupBy = datSourceItemList.GroupBy(b => b.GetValue<Guid>("DataSourceId"));

            var itemList = (from a in userConditionSelectValueList
                            from b in dataSourceGroupBy
                            where a.GetValue<Guid>("DataSourceId") == b.Key
                            select new { a, b });

            foreach (var c in itemList)
            {
                c.a.SetValue("DataSource", c.b.ToList());
            }

            var groupby = userConditionSelectValueList.GroupBy(b => b.GetValue<Guid>("UserConditionTypeId"));

            var list = (from a in userConditionTypeList
                        from b in groupby
                        where a.GetValue<Guid>("UserConditionTypeId") == b.Key
                        select new { a, b });

            foreach (var c in list)
            {
                c.a.SetValue("Items", c.b.OrderBy(b => b.GetValue<int>("DisplayIndex")).ToList());
            }

            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("ConditionTypes" + selectType.ToString(), userConditionTypeList);
            return dict;
        }

        List<IEntityData> GetUserConditionType(Guid userId, byte selectType)
        {
            IQuery query = new Query("v_UserConditionType2");

            List <IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@UserId", userId));
            parameterList.Add(this.InParameter("@SelectType", selectType));

            query.Where("where UserId=@UserId and SelectType=@SelectType", parameterList);
            query.OrderBy("order by CreateDate2");

            return this.SelectEntities(query);
        }

        List<IEntityData> GetUserConditionSelectValue(Guid userId, byte selectType)
        {
            IQuery query = new Query("v_UserConditionSelectValue");

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@UserId", userId));
            parameterList.Add(this.InParameter("@SelectType", selectType));

            query.Where("where UserId=@UserId and SelectType=@SelectType", parameterList);

            return this.SelectEntities(query);
        }

        /// <summary>
        /// 以数据源主键集合获取实体数据列表
        /// </summary>
        /// <param name="dataSourceIds"></param>
        /// <returns></returns>
        public List<IEntityData> GetEnityDataListByDataSourceIds(List<Guid> dataSourceIds)
        {
            if (dataSourceIds == null || dataSourceIds.Count == 0) return new List<IEntityData>();

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();

            List<string> inParameterList = new List<string>();
            dataSourceIds.ForEach(n =>
            {
                var parameterName = "@P" + Guid.NewGuid().ToString().Substring(0, 8).ToString();
                parameterList.Add(this.InParameter(parameterName, n));
                inParameterList.Add(parameterName);
            });

            IQuery query = new Query("v_DataSourceItem");
            query.Where(string.Format("where DataSourceId in ({0})", string.Join(",", inParameterList)), parameterList);
            return this.SelectEntities(query);
        }
    }
}
