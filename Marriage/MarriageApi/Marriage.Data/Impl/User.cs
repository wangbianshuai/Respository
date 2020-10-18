using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class User : EntityAccess, IUser
    {
        public User()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.User>();
        }

        /// <summary>
        /// 获取最近更新时间
        /// </summary>
        /// <returns></returns>
        public DateTime GetLastUpdateDate()
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("max(UpdateDate) UpdateDate");
            IEntityData entityData = this.SelectEntity(query);
            if (entityData == null) return DateTime.MinValue;
            return entityData.GetValue<DateTime>("UpdateDate");
        }

        /// <summary>
        /// 删除当前App账号下用户
        /// </summary>
        /// <param name="appAccountId"></param>
        /// <returns></returns>
        public bool DeleteByAppAccountId(Guid appAccountId)
        {
            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@AppAccountId", appAccountId));

            IQuery query = new Query(this.EntityType.TableName);
            query.Where("where AppAccountId=@AppAccountId", parameterList);

            return this.DeleteEntity(query);
        }

        /// <summary>
        /// 批量插入记录
        /// </summary>
        /// <param name="dt"></param>
        public void BullInsert(List<IEntityData> entityDataList)
        {
            (this.CurrentDataBase as ISqlDataBase).SqlBulkCopyInsert(GetDataTable(entityDataList), "t_User");
        }

        /// <summary>
        /// 获取数据表
        /// </summary>
        /// <param name="entityDataList"></param>
        /// <returns></returns>
        DataTable GetDataTable(List<IEntityData> entityDataList)
        {
            DataTable dt = new DataTable();

            dt.Columns.Add(new DataColumn("OpenId", typeof(string)));
            dt.Columns.Add(new DataColumn("AppAccountId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("UnionId", typeof(string)));
            dt.Columns.Add(new DataColumn("NickName", typeof(string)));
            dt.Columns.Add(new DataColumn("Sex", typeof(int)));
            dt.Columns.Add(new DataColumn("City", typeof(string)));
            dt.Columns.Add(new DataColumn("Province", typeof(string)));
            dt.Columns.Add(new DataColumn("HeadImgUrl", typeof(string)));
            dt.Columns.Add(new DataColumn("Remark", typeof(string)));
            dt.Columns.Add(new DataColumn("UpdateUser", typeof(Guid)));
            dt.Columns.Add(new DataColumn("UpdateDate", typeof(DateTime)));

            DataRow dr = null;

            entityDataList.ForEach(d =>
            {
                dr = dt.NewRow();

                foreach (DataColumn column in dt.Columns)
                {
                    dr[column.ColumnName] = d.GetValue(column.ColumnName);
                }

                dt.Rows.Add(dr);
            });
            return dt;
        }
    }
}
