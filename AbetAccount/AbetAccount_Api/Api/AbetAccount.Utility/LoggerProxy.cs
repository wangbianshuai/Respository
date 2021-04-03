using log4net;
using log4net.Repository;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace AbetAccount.Utility
{
    public class LoggerProxy
    {
        static ILog _Log { get; set; }

        public static void InitLogger(ILoggerRepository repository)
        {
            _Log = LogManager.GetLogger(repository.Name, "AbetAccount");
        }

        static LoggerProxy()
        {
            _LogDictionary = new System.Collections.Concurrent.ConcurrentDictionary<string, object>();
        }

        public static void Info(string entityName, string methodName, Dictionary<string, object> dict)
        {
            Task.Run(() => WriteLog("Info", entityName, methodName, null, dict));
        }

        public static void Info(string entityName, string methodName, List<string> messageList)
        {
            Task.Run(() => WriteLog("Info", entityName, methodName, null, null, messageList));
        }

        public static void Exception(string entityName, string methodName, Exception ex, Dictionary<string, object> dict = null, List<string> messageList = null)
        {
            Task.Run(() => WriteLog("Exception", entityName, methodName, ex, dict, messageList));
        }

        public static void WriteLog(string logType, string entityName, string methodName, Exception ex, Dictionary<string, object> dict = null, List<string> messageList = null)
        {
            if (_Log != null)
            {
                if (dict == null) dict = new Dictionary<string, object>();
                dict.Add("EntityName", entityName);
                dict.Add("MethodName", methodName);
                if (messageList != null) dict.Add("MessageList", messageList);

                WriteLog(logType, dict, ex);
            }
            WriteLocalLog(logType, entityName, methodName, ex, dict, messageList);
        }

        public static void WriteLog(string logType, object message, Exception ex)
        {
            if (ex != null) Common.GetInnerException(ex);

            if (logType == "Info") _Log.Info(message, ex);
            else if (logType == "Exception") _Log.Error(message, ex);
        }

        static System.Collections.Concurrent.ConcurrentDictionary<string, object> _LogDictionary { get; set; }

        public static void WriteLocalLog(string logType, string entityName, string methodName, Exception ex = null, Dictionary<string, object> dict = null, List<string> messageList = null)
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

                    using (TextWriter writer = new StreamWriter(path, true, Encoding.UTF8))
                    {
                        writer.WriteLine(string.Format("LogType：{0}", logType));
                        writer.WriteLine(string.Format("LogDate：{0}", DateTime.Now));

                        if (dict != null)
                        {
                            foreach (var kvp in dict)
                            {
                                writer.WriteLine(string.Format("{0}：{1}", kvp.Key, kvp.Value));
                            }
                        }

                        if (messageList != null)
                        {
                            messageList.ForEach(m =>
                            {
                                writer.WriteLine(m);
                            });
                        }

                        if (ex != null)
                        {
                            writer.WriteLine("Excption:");
                            writer.WriteLine("           Message:" + ex.Message);
                            writer.WriteLine("           Source:" + ex.Source);
                            writer.WriteLine("         StackTrace:" + ex.StackTrace);
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
