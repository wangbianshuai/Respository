using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using OpenDataAccessCore.Data;
using System.Net.Http;
using OpenDataAccessCore.Utility;
using System.Data;

namespace Marriage.Component
{
    public class LiveVodPlayInfo : EntityRequest
    {
        public LiveVodPlayInfo()
        {
        }

        public LiveVodPlayInfo(Request request)
            : base(request)
        {
        }

        [Log]
        public object SyncPlayFlux()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            var liveList = GetLiveList();

            List<Entity.LiveVodPlayInfo> liveVodPlayInfoList = new List<Entity.LiveVodPlayInfo>();
            DateTime createDate = DateTime.Now;
            liveList.ForEach(live =>
            {
                liveVodPlayInfoList.Add(GetLiveVodPlayInfo(entityData,live.GetStringValue("EditMediaFileId"), createDate));
            });

            DeleteLiveVodPlayInfoByDayTime(entityData.GetValue<DateTime>("dayTime"));

            BulkCopyInsert(liveVodPlayInfoList);

            return this.GetBoolDict(true);
        }

        Entity.LiveVodPlayInfo GetLiveVodPlayInfo(IEntityData entityData,string fileId, DateTime createDate)
        {
            Entity.LiveVodPlayInfo entity = new Entity.LiveVodPlayInfo();

            string dayTime = entityData.GetStringValue("dayTime").Substring(0, 10);
            entity.CreateDate = createDate;
            entity.DayTime = DateTime.Parse(dayTime);
            entity.FileId = fileId;
            entity.InfoId = Guid.NewGuid();

            RequestQueryFilePlayFlux(entity, fileId, dayTime, entityData);

            return entity;
        }

        void BulkCopyInsert(List<Entity.LiveVodPlayInfo> liveVodPlayInfoList)
        {
            ((ISqlDataBase)this.CurrentDataBase).SqlBulkCopyInsert(DictionaryListToDataTable(liveVodPlayInfoList), this.EntityType.TableName);
        }

        private DataTable DictionaryListToDataTable(List<Entity.LiveVodPlayInfo> liveVodPlayInfoList)
        {
            DateTime createDate = DateTime.Now;

            DataTable dt = new DataTable();

            dt.Columns.Add(new DataColumn("InfoId", typeof(Guid)));
            dt.Columns.Add(new DataColumn("FileId", typeof(string)));
            dt.Columns.Add(new DataColumn("DayTime", typeof(DateTime)));
            dt.Columns.Add(new DataColumn("TotalFlux", typeof(decimal)));
            dt.Columns.Add(new DataColumn("ResponseStatus", typeof(byte)));
            dt.Columns.Add(new DataColumn("ResponseContent", typeof(string)));
            dt.Columns.Add(new DataColumn("CreateDate", typeof(DateTime)));

            DataRow dr = null;

            liveVodPlayInfoList.ForEach(d =>
            {
                dr = dt.NewRow();

                dr["CreateDate"] = d.CreateDate;
                dr["DayTime"] = d.DayTime;
                dr["FileId"] = d.FileId;
                dr["InfoId"] = d.InfoId;
                dr["ResponseContent"] = d.ResponseContent;
                dr["ResponseStatus"] = d.ResponseStatus;
                dr["TotalFlux"] = d.TotalFlux;

                if (d.TotalFlux > 0 || d.ResponseStatus == 2) dt.Rows.Add(dr);
                else dr["ResponseStatus"] = 0;
            });
            if (dt.Rows.Count == 0)
            {
                dt.Rows.Add(dr);
            }
            return dt;
        }

        bool DeleteLiveVodPlayInfoByDayTime(DateTime dayTime)
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Where("where DayTime >= @StartDate and DayTime<@EndDate", new List<System.Data.IDbDataParameter>()
            {
                this.InParameter("@StartDate", dayTime),
                this.InParameter("@EndDate", dayTime.AddDays(1))
            });
            return this.DeleteEntity(query);
        }

        void RequestQueryFilePlayFlux(Entity.LiveVodPlayInfo entity,string fileId, string dayTime, IEntityData entityData)
        {
            try
            {
                string mc_gtk = entityData.GetStringValue("mc_gtk");
                string uin = entityData.GetStringValue("uin");
                string skey = entityData.GetStringValue("skey");

                string url = "https://vods.cloud.tencent.com/vodtraffic/queryFilePlayFlux";
                url = url + string.Format("?file_id={0}&start_date={1}&end_date={1}&mc_gtk={2}&env=prod", fileId, dayTime, mc_gtk);

                HttpClient client = new HttpClient();

                var message = new HttpRequestMessage(HttpMethod.Get, url);
                message.Headers.Add("Cookie", string.Format("uin={0};skey={1};", uin, skey));

                string content = client.SendAsync(message).Result.Content.ReadAsStringAsync().Result;

                if (content.StartsWith("callback"))
                {
                    //{ "retcode":0,"errmsg":"succ","data":{ "totalPlayTimes":0,"totalFlux":0,"fileInfo":{ "file_id":"5285890807377084896","name":"skwffhp_383827","size":20487287,"duration":347,"create_time":"2020-09-09 10:16:01","status":2},"data":[]},"stime":"0.1066"}

                    content = content.Substring(9, content.Length - 10);

                    Dictionary<string, object> dict = Parse.JsonToDictionary(content);

                    if (dict.GetValue<int>("retcode") == 0)
                    {
                        dict = dict.GetValue<Dictionary<string, object>>("data");
                        entity.TotalFlux = Math.Round(dict.GetValue<double>("totalFlux") / (1024 * 1024), 2);
                        entity.ResponseStatus = 1;
                    }
                    else entity.ResponseStatus = 2;
                    entity.ResponseContent = content;
                }
                else
                {
                    entity.ResponseStatus = 2;
                    entity.ResponseContent = content;
                }

            }
            catch (Exception ex)
            {
                entity.ResponseStatus = 2;
                entity.ResponseContent = ex.Message;
            }
        }

        List<IEntityData> GetLiveList()
        {
            IQuery query = new Query("t_Live");
            query.Select("EditMediaFileId");
            query.Where("where EditMediaFileId is not null");
            return this.SelectEntities(query);
        }
    }
}
