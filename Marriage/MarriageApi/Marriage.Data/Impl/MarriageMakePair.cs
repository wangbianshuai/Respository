using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class MarriageMakePair : EntityAccess, IMarriageMakePair
    {
        public MarriageMakePair()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.MarriageMakePair>();
        }

        /// <summary>
        /// 获取相亲匹配用户列表
        /// </summary>
        /// <returns></returns>
        public List<IEntityData> GetMarriageMakePairUsers()
        {
            IQuery query = new Query("v_MarriageMakePair2");

            query.SetSql("select ManUserId,WomanUserId from v_MarriageMakePair2 where ArrangeId is not null");

            return this.SelectEntities(query);
        }

        /// <summary>
        /// 删除相亲匹配
        /// </summary>
        /// <returns></returns>
        public bool DeleteMarriageMakePair()
        {
            string sql = "delete from t_MarriageMakePair where not exists (select 1 from v_MarriageMakePair2 b where t_MarriageMakePair.MakePairId in (b.MakePairId,b.MakePairId2) and b.ArrangeId is not null)";

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
            DateTime createDate = DateTime.Now;

            DataTable dt = new DataTable();

            dt.Columns.Add(new DataColumn("MakePairId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("UserId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("OtherSideUserId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("PercentValue", typeof(decimal)));
            dt.Columns.Add(new DataColumn("CreateDate", typeof(DateTime)));

            DataRow dr = null;

            dictList.ForEach(dict =>
            {
                dr = dt.NewRow();
                dict["CreateDate"] = createDate;
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
