using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocketCommunication.SocketCore
{
    public class LoggerProxy
    {
        static LoggerProxy()
        {
            _LogDictionary = new System.Collections.Concurrent.ConcurrentDictionary<string, object>();
        }

        public static void Info(string entityName, string methodName, Dictionary<string, string> dict)
        {
            Task.Run(() => WriteLog("Info", entityName, methodName, dict));
        }

        public static void Info(string entityName, string methodName, List<string> messageList)
        {
            Task.Run(() => WriteLog("Info", entityName, methodName, null, null, messageList));
        }

        public static void Exception(string entityName, string methodName, Exception ex, Dictionary<string, string> dict = null, List<string> messageList = null)
        {
            Task.Run(() => WriteLog("Exception", entityName, methodName, dict, Common.GetInnerException(ex), messageList));
        }

        static System.Collections.Concurrent.ConcurrentDictionary<string, object> _LogDictionary { get; set; }

        public static void WriteLog(string logType, string entityName, string methodName, Dictionary<string, string> dict = null, Exception ex = null, List<string> messageList = null)
        {
            try
            {
                if (ex != null) ex = Common.GetInnerException(ex);
                string logFilesName = "Log_" + DateTime.Now.ToString("yyyy-MM-dd");
                string path = "Logs/" + logFilesName + "/" + logType + "/" + entityName + "/" + methodName + "/";

                path = AppDomain.CurrentDomain.BaseDirectory + path.Replace("/", "\\");

                DirectoryInfo direct = new DirectoryInfo(path);
                if (!direct.Exists)
                {
                    direct.Create();
                    _LogDictionary[path] = entityName + "_" + methodName + Guid.NewGuid().ToString().Substring(0, 8).ToUpper() + ".txt";
                }

                if (!_LogDictionary.ContainsKey(path)) _LogDictionary[path] = entityName + "_" + methodName + Guid.NewGuid().ToString().Substring(0, 8).ToUpper() + ".txt";

                lock (_LogDictionary[path])
                {
                    path += _LogDictionary[path];

                    StringBuilder sb = new StringBuilder();

                    using (TextWriter writer = new StreamWriter(path, true, Encoding.UTF8))
                    {
                        writer.WriteLine(string.Format("LogType：{0}", logType));
                        writer.WriteLine(string.Format("EntityName：{0}", entityName));
                        writer.WriteLine(string.Format("MethodName：{0}", methodName));

                        if (logType == "Exception")
                        {
                            sb.AppendLine(string.Format("LogType：{0}", logType));
                            sb.AppendLine(string.Format("EntityName：{0}", entityName));
                            sb.AppendLine(string.Format("MethodName：{0}", methodName));
                        }

                        if (dict != null)
                        {
                            foreach (var kvp in dict)
                            {
                                writer.WriteLine(string.Format("{0}：{1}", kvp.Key, kvp.Value));

                                if (logType == "Exception") sb.AppendLine(string.Format("{0}：{1}", kvp.Key, kvp.Value));
                            }
                        }

                        if (messageList != null)
                        {
                            messageList.ForEach(m =>
                            {
                                writer.WriteLine(m);

                                if (logType == "Exception") sb.AppendLine(m);
                            });
                        }

                        if (ex != null)
                        {
                            writer.WriteLine("Excption:");
                            writer.WriteLine("           Message:" + ex.Message);
                            writer.WriteLine("           Source:" + ex.Source);
                            writer.WriteLine("         StackTrace:" + ex.StackTrace);

                            if (logType == "Exception")
                            {
                                sb.AppendLine("Excption:");
                                sb.AppendLine("           Message:" + ex.Message);
                                sb.AppendLine("           Source:" + ex.Source);
                                sb.AppendLine("         StackTrace:" + ex.StackTrace);
                            }
                        }

                        writer.WriteLine(string.Empty);
                    }
                }
            }
            catch
            {
            }
        }
    }
}
