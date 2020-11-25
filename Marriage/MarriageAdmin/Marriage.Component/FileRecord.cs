using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Marriage.Component
{
    public class FileRecord : EntityRequest
    {
        public FileRecord()
        {
        }

        public FileRecord(Request request)
            : base(request)
        {
            this.CurrentDataBase.ConnectionString = this.CurrentDataBase.ConnectionString.Replace("Marriage", "Resources");
        }


        [Log]
        public object Delete2()
        {
            List<IEntityData> entityDataList = this._Request.Entities[this.EntityType.Name];
            entityDataList.ForEach(e =>
            {
                DeleteFileRecord(e.GetValue<Guid>("FileId"), e.GetStringValue("AppId"));
            });
            return GetBoolDict(true);
        }

        void DeleteFileRecord(Guid fileId, string appId)
        {
            string url = OpenDataAccessCore.Utility.AppSettings.GetAppSetting("ResourceApiUrl") + "api/Resources/DeleteFile";

            Dictionary<string, string> headers = new Dictionary<string, string>();

            headers.Add("token", GetToken(appId));

            string result = PostRequest(url, OpenDataAccessCore.Utility.Common.ToJson(new { FileId = fileId }), headers);

            Dictionary<string, object> dict = OpenDataAccessCore.Entity.Parse.JsonToDictionary(result);
            if (dict.ContainsKey("Ack"))
            {
                dict = dict.GetValue<Dictionary<string, object>>("Ack");
                if (!dict.GetValue<bool>("IsSuccess"))
                {
                    throw new Exception(dict.GetStringValue("Message"));
                }
            }
        }

        string GetToken(string appId)
        {
            string key = "784253FE-2E15-459F-93F3-26A23E9DE4B2";
            long time = Utility.Common.GetDateTotalMilliseconds(DateTime.Now);
            string md5 = Utility.Common.ComputeStringMd5(appId + time + key);
            return OpenDataAccessCore.Utility.Common.ToBase64String(appId + "@" + time + "@" + md5);
        }

        private string PostRequest(string url, string requestJson, Dictionary<string, string> headers)
        {
            HttpClient client = new HttpClient();
            if (headers != null)
            {
                foreach (var kvp in headers) client.DefaultRequestHeaders.Add(kvp.Key, kvp.Value);
            }
            Task<HttpResponseMessage> response = client.PostAsync(url, new StringContent(requestJson, Encoding.UTF8, "application/json"));

            return response.Result.Content.ReadAsStringAsync().Result;
        }

        public object Select2()
        {
            var obj = this.Select();

            if (obj is List<IEntityData>)
            {
                List<IEntityData> dataList = obj as List<IEntityData>;

                string apiUrl = OpenDataAccessCore.Utility.AppSettings.GetAppSetting("ResourceApiUrl");

                dataList.ForEach(d =>
                {
                    d.SetValue("FilePath", apiUrl + d.GetStringValue("FilePath"));
                    d.SetValue("FileSize", Utility.Common.GetFileSize(d.GetValue<int>("FileSize")));
                });

            }

            return obj;
        }
    }
}
