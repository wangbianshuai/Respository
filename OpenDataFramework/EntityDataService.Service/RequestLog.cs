using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Configuration;
using System.IO;
using System.Runtime.Remoting.Messaging;
using System.Threading;
using EntityDataService.Entity;
using EntityDataService.Data;
using System.Data;
using System.Data.SqlClient;
using EntityDataService.Utility;

namespace EntityDataService.Service
{
    public delegate void AsyncWriteRequestLogDelegate(Request request,object obj, string responseContent);

    public class RequestLog
    {
        public static bool IsLog { get; set; }

        static RequestLog()
        {
            string isLog = ConfigurationManager.AppSettings["IsLog"];
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
                AsyncWriteRequestLogDelegate asyncWriteLog = AsyncWriteRequestLog;
                IAsyncResult asyncResult = asyncWriteLog.BeginInvoke(request, obj, responseContent, WriteRequestLogCallback, null);
                ThreadPool.RegisterWaitForSingleObject(
                  asyncResult.AsyncWaitHandle,
                  WriteLogCompleteCallback,
                  new List<object>() { asyncResult },
                  1800000,
                  true);
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
                    if (!string.IsNullOrEmpty(request.MethodName))
                    {
                        if (!request.IsLog)
                        {
                            return;
                        }
                    }
                    else if (request.RequestType == "GET")
                    {
                        if (!request.Entity.LogAttribute.IsGet)
                        {
                            return;
                        }
                        return;
                    }
                    else if (request.RequestType == "POST")
                    {
                        if (request.IsPostQuery && !request.Entity.LogAttribute.IsPostQuery)
                        {
                            return;
                        }
                        else if(!request.Entity.LogAttribute.IsPost)
                        {
                            return;
                        }
                    }
                    else if (request.RequestType == "PUT")
                    {
                        if (!request.Entity.LogAttribute.IsPut)
                        {
                            return;
                        }
                    }
                    else if (request.RequestType == "DELETE")
                    {
                        if (!request.Entity.LogAttribute.IsDelete)
                        {
                            return;
                        }
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
                entityData.SetValue("LogType", logType);
                entityData.SetValue("LogPath", logPath);
                entityData.SetValue("EntityName", request.EntityName);
                entityData.SetValue("RequestType", request.RequestType);
                entityData.SetValue("MethodName", request.MethodName);
                entityData.SetValue("StartTime", request.StartTime);
                entityData.SetValue("EndTime", request.EndTime);
                entityData.SetValue("ElapsedMilliseconds", request.ElapsedMilliseconds);
                entityData.SetValue("OperationUser", request.OperationUser);
                entityData.SetValue("IPAddress", request.IPAddress);
    
                EntityRequest entityRequest = new EntityRequest();
                object primaryKey = null;
                entityRequest.InsertEntity(request.OperationLogEntity, entityData, out primaryKey);
            }
            catch
            {
            }
        }

        private static void WriteRequestLogCallback(IAsyncResult result)
        {
            AsyncWriteRequestLogDelegate d = (AsyncWriteRequestLogDelegate)((AsyncResult)result).AsyncDelegate;
            d.EndInvoke(result);
        }

        private static void WriteLogCompleteCallback(object state, bool isTimeout)
        {
            try
            {
                List<object> stateList = state as List<object>;
                IAsyncResult result = stateList[0] as IAsyncResult;

                if (isTimeout)
                {
                    if (!result.IsCompleted)
                    {
                        result.AsyncWaitHandle.Close();
                    }
                }
            }
            catch
            {
            }
        }

        public static void WriteRequestLog(EntityDataService.Service.Request request, string content)
        {
            try
            {
                string logType = "Success";
                Dictionary<string, object> dict = JsonParse.JsonToDictionary(content);
                dict = dict["Ack"] as Dictionary<string, object>;
                if (!(bool)dict["IsSuccess"])
                {
                    int statusCode = (int)dict["StatusCode"];
                    logType = statusCode == 101 ? "Exception" : "Message";
                }

                if (logType.Equals("Success") && request.RequestType.ToLower().Trim().Equals("query")) return;

                string logFilesName = "Log_" + DateTime.Now.ToString("yyyy-MM-dd");
                string path = "Logs/" + logFilesName + "/" + logType + "/" + request.EntityName + "/" + request.RequestType;

                string logPath = path;

                path = request.RootPath + path.Replace("/", "\\");

                DirectoryInfo direct = new DirectoryInfo(path);
                if (!direct.Exists)
                {
                    direct.Create();
                }

                string fileName = request.EntityName + "_" + request.RequestId.ToString().Substring(0, 8).ToUpper() + ".txt";
                path += "\\" + fileName;
                logPath += "/" + fileName;

                using (TextWriter writer = new StreamWriter(path, false, Encoding.UTF8))
                {
                    if (request.CustomWriterLog == null)
                    {
                        writer.WriteLine("Request:");
                        writer.WriteLine("                         Url:" + request.RawUrl);
                        writer.WriteLine("                        Data:" + request.Content);
                        writer.WriteLine("                  EntityName:" + request.EntityName);
                        writer.WriteLine("                  MethodName:" + request.RequestType);
                        writer.WriteLine("                   IPAddress:" + request.IPAddress);
                        writer.WriteLine("               OperationUser:" + request.OperationUser);
                        writer.WriteLine("                   StartTime:" + request.StartTime.ToString("yyyy-MM-dd HH:mm:ss.fff"));
                        writer.WriteLine("                     EndTime:" + request.EndTime.ToString("yyyy-MM-dd HH:mm:ss.fff"));
                        writer.WriteLine("         ElapsedMilliseconds:" + request.ElapsedMilliseconds);
                        writer.WriteLine();
                        writer.WriteLine();
                        writer.WriteLine();
                        writer.WriteLine("Response:");
                        writer.WriteLine(content);
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
                        request.CustomWriterLog(writer, content);
                    }
                }

                request.OperationLogEntity = EntityType.GetEntityType<OpenDataFramework.Entity.OperationLog>();
                if (request.OperationLogEntity != null)
                {
                    InsertOperationLog(request, logType, logPath);
                }
            }
            catch
            {
            }
        }
    }
}
