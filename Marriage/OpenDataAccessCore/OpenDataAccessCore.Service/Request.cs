using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Web;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Data;
using System.IO;

namespace OpenDataAccessCore.Service
{
    public class Request
    {
        public Guid RequestId { get; private set; }
        public string Content { get; set; }
        public Dictionary<string, List<IEntityData>> Entities { get; set; }
        public EntityType Entity { get; set; }
        public EntityType OperationLogEntity { get; set; }
        public string MethodName { get; set; }
        public string RequestType { get; set; }
        public NameValueCollection QueryString { get; set; }
        public string EntityName { get; set; }
        public string OperationUser { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public long ElapsedMilliseconds { get; set; }
        public bool IsLog { get; set; }
        public bool IsPostQuery { get; set; }
        public string IPAddress { get; set; }
        public Action<TextWriter, string> CustomWriterLog { get; set; }
        public Exception Excption { get; set; }
        public string RootPath { get; set; }
        public string PathAndQuery { get; set; }
        public string RawUrl { get; set; }
        public string PathInfo { get; set; }

        public string Sign { get; set; }

        public string AppId { get; set; }

        public string Token { get; set; }

        public Func<bool> IsDirectRequest { get; set; }

        public Request()
        {
            this.RequestId = Guid.NewGuid();
        }

        public string GetParameterValue(string name)
        {
            string key = this.QueryString.AllKeys.Where(where => where.Trim().ToLower() == name.Trim().ToLower()).FirstOrDefault();
            if (key != null)
            {
                if (this.QueryString[key] == "undefined")
                {
                    return string.Empty;
                }
                else
                {
                    return HttpUtility.UrlDecode(this.QueryString[key].Trim());
                }
            }
            else
            {
                return string.Empty;
            }
        }
    }
}
