using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class MarriageMakePairDetail : EntityAccess, IMarriageMakePairDetail
    {
        public MarriageMakePairDetail()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.MarriageMakePairDetail>();
        }

        /// <summary>
        /// 删除相亲匹配明细 
        /// </summary>
        /// <returns></returns>
        public bool DeleteMarriageMakePairDetail()
        {
            string sql = "delete from t_MarriageMakePairDetail where not exists (select 1 from v_MarriageMakePair2 b where t_MarriageMakePairDetail.MakePairId in (b.MakePairId,b.MakePairId2) and b.ArrangeId is not null)";

            return this.CurrentDataBase.ExecSqlNonQuery(sql);
        }

        /// <summary>
        /// 批量插入
        /// </summary>
        /// <param name="dictList"></param>
        /// <returns></returns>
        public void BulkCopyInsert(List<Dictionary<string, object>> dictList)
        {
            ((ISqlDataBase)this.CurrentDataBase).SqlBulkCopyInsert(DictionaryListToDataTable(dictList), this.EntityType.TableName);
        }

        private DataTable DictionaryListToDataTable(List<Dictionary<string, object>> dictList)
        {
            DataTable dt = new DataTable();

            dt.Columns.Add(new DataColumn("DetailId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("MakePairId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("ConditionTypeId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("ConditionTypeName", typeof(string)));
            dt.Columns.Add(new DataColumn("ConditionItemId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("ConditionItemTitle", typeof(string)));
            dt.Columns.Add(new DataColumn("SelfSelectValue", typeof(string)));
            dt.Columns.Add(new DataColumn("OtherSideSelectValue", typeof(string)));
            dt.Columns.Add(new DataColumn("PercentValue", typeof(decimal)));

            DataRow dr = null;

            dictList.ForEach(dict =>
            {
                dr = dt.NewRow();
                foreach (DataColumn column in dt.Columns)
                {
                    dr[column.ColumnName] = dict[column.ColumnName];
                }

                dt.Rows.Add(dr);
            });
            return dt;
        }
    }
}
