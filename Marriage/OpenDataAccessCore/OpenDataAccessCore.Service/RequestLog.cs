using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Configuration;
using System.IO;
using OpenDataAccessCore.Entity;
using System.Threading.Tasks;

namespace OpenDataAccessCore.Service
{
    public class RequestLog
    {
        public static bool IsLog { get; set; }

        static RequestLog()
        {
            string isLog = Utility.AppSettings.GetAppSetting("IsLog");
            if (!string.IsNullOrEmpty(isLog) && bool.Parse(isLog))
            {
                IsLog = true;
            }
            else
            {
                IsLog = false;
            }
        }

        public static void AddRequestLog(Request request, object obj, string responseContent)
        {
            if (IsLog)
            {
                Task.Run(() => AsyncWriteRequestLog(request, obj, responseContent));
            }
        }

        public static void AsyncWriteRequestLog(Request request, object obj, string responseContent)
        {
            try
            {
                string logType = "Success";
                if (obj is Dictionary<string, object>)
                {
                    if ((obj as Dictionary<string, object>).ContainsKey("Exception"))
                    {
                        logType = "Exception";
                    }
                    else if ((obj as Dictionary<string, object>).ContainsKey("Message"))
                    {
                        logType = "Message";
                    }
                }

                if (logType == "Success")
                {
                    if (request.Entity == null) return;

                    if (!string.IsNullOrEmpty(request.MethodName))
                    {
                        if (!request.IsLog) return;
                    }
                    else if (request.RequestType == "GET")
                    {
                        if (!request.Entity.LogAttribute.IsGet) return;
                    }
                    else if (request.RequestType == "POST")
                    {
                        if (request.IsPostQuery && !request.Entity.LogAttribute.IsPostQuery) return;
                        else if (!request.Entity.LogAttribute.IsPost) return;
                    }
                    else if (request.RequestType == "PUT")
                    {
                        if (!request.Entity.LogAttribute.IsPut) return;
                    }
                    else if (request.RequestType == "DELETE")
                    {
                        if (!request.Entity.LogAttribute.IsDelete) return;
                    }
                }

                WriteLog(request, logType, responseContent);
            }
            catch
            {
            }
        }

        private static void WriteLog(Request request, string logType, string responseContent)
        {
            string logFilesName = "Log_" + DateTime.Now.ToString("yyyy-MM-dd");
            string path = "Logs/" + logFilesName + "/" + logType + "/" + request.EntityName + "/";

            if (!string.IsNullOrEmpty(request.MethodName))
            {
                path += request.MethodName;
            }
            else if (request.RequestType == "POST" && request.IsPostQuery)
            {
                path += "PostQuery";
            }
            else
            {
                path += request.RequestType;
            }
            string logPath = path;
           
            path = request.RootPath + path.Replace("/", "\\");
           
            DirectoryInfo direct = new DirectoryInfo(path);
            if (!direct.Exists)
            {
                direct.Create();
            }

            string fileName = request.EntityName + "_" + request.RequestId.ToString().Substring(0, 8).ToUpper() + ".txt";
            path += "/" + fileName;
            logPath += "/" + fileName;

            using (TextWriter writer = new StreamWriter(path, false, Encoding.UTF8))
            {
                if (request.CustomWriterLog == null)
                {
                    writer.WriteLine("Request:");
                    writer.WriteLine("                         Url:" + request.RawUrl);
                    writer.WriteLine("                        Data:" + request.Content);
                    writer.WriteLine("                  EntityName:" + request.EntityName);
                    writer.WriteLine("                  MethodName:" + request.MethodName);
                    writer.WriteLine("                 RequestType:" + request.RequestType);
                    writer.WriteLine("                   IPAddress:" + request.IPAddress);
                    writer.WriteLine("               OperationUser:" + request.OperationUser);
                    writer.WriteLine("                   StartTime:" + request.StartTime.ToString("yyyy-MM-dd HH:mm:ss.fff"));
                    writer.WriteLine("                     EndTime:" + request.EndTime.ToString("yyyy-MM-dd HH:mm:ss.fff"));
                    writer.WriteLine("         ElapsedMilliseconds:" + request.ElapsedMilliseconds);
                    writer.WriteLine();
                    writer.WriteLine();
                    writer.WriteLine();
                    writer.WriteLine("Response:");
                    writer.WriteLine(responseContent);
                    if (request.Excption != null)
                    {
                        writer.WriteLine("Excption:");
                        writer.WriteLine("           Message:" + request.Excption.Message);
                        writer.WriteLine("           Source:" + request.Excption.Source);
                        writer.WriteLine("         StackTrace:" + request.Excption.StackTrace);
                    }
                }
                else
                {
                    request.CustomWriterLog(writer, responseContent);
                }
            }

            if (request.OperationLogEntity != null)
            {
                InsertOperationLog(request, logType, logPath);
            }
        }

        private static void InsertOperationLog(Request request, string logType, string logPath)
        {
            try
            {
                IEntityData entityData = new EntityData(request.OperationLogEntity);
                entityData.SetValue("AppAccountId", request.AppAccountId);
                entityData.SetValue("LogType", logType);
                entityData.SetValue("LogPath", logPath);
                entityData.SetValue("EntityName", request.EntityName);
                entityData.SetValue("RequestType", request.RequestType);
                entityData.SetValue("MethodName", request.MethodName);
                entityData.SetValue("StartTime", request.StartTime);
                entityData.SetValue("EndTime", request.EndTime);
                entityData.SetValue("ElapsedMilliseconds", request.ElapsedMilliseconds);
                if(!string.IsNullOrEmpty(request.OperationUser)) entityData.SetValue("OperationUser", request.OperationUser);
                entityData.SetValue("IPAddress", request.IPAddress);
    
                EntityRequest entityRequest = new EntityRequest();
                object primaryKey = null;
                entityRequest.InsertEntity(request.OperationLogEntity, entityData, out primaryKey);
            }
            catch
            {
            }
        }
    }
}
