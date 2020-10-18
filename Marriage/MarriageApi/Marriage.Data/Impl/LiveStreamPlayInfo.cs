using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class LiveStreamPlayInfo : EntityAccess, ILiveStreamPlayInfo
    {
        public LiveStreamPlayInfo()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.LiveStreamPlayInfo>();
        }

        /// <summary>
        /// 以日期和页码删除数据
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        public bool DeleteByDayTimeAndPageNum(string dayTime, int pageNum)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@DayTime", dayTime));
            parameterList.Add(this.InParameter("@PageNum", pageNum));

            query.Where("where DayTime=@DayTime and PageNum=@PageNum", parameterList);

            return this.DeleteEntity(query);
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

            dt.Columns.Add(new DataColumn("InfoId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("DayTime", typeof(string)));
            dt.Columns.Add(new DataColumn("PageNum", typeof(int)));
            dt.Columns.Add(new DataColumn("StreamName", typeof(string)));
            dt.Columns.Add(new DataColumn("TotalFlux", typeof(decimal)));
            dt.Columns.Add(new DataColumn("CreateDate", typeof(string)));

            DataRow dr = null;

            dictList.ForEach(dict =>
            {
                dr = dt.NewRow();
                dict["CreateDate"] = createDate;
                dict["InfoId"] = Guid.NewGuid();
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
 