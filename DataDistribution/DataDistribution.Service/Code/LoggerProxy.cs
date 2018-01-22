using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataDistribution.Service.Code
{
    public class LoggerProxy
    {
        public static void Info(string entityName, string methodName, Dictionary<string, string> dict)
        {
            Task.Run(() => WriteLog("Info", entityName, methodName, dict));
        }

        public static void Exception(string entityName, string methodName, Exception ex, Dictionary<string, string> dict = null)
        {
            Task.Run(() => WriteLog("Exception", entityName, methodName, dict, Common.GetInnerException(ex)));
        }

        public static void WriteLog(string logType, string entityName, string methodName, Dictionary<string, string> dict, Exception ex = null)
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
                }

                string fileName = entityName + "_" + methodName + Guid.NewGuid().ToString().Substring(0, 8).ToUpper() + ".txt";
                path += fileName;

                using (TextWriter writer = new StreamWriter(path, false, Encoding.UTF8))
                {
                    writer.WriteLine(string.Format("LogType：{0}", logType));
                    writer.WriteLine(string.Format("EntityName：{0}", entityName));
                    writer.WriteLine(string.Format("MethodName：{0}", methodName));

                    if (dict != null)
                    {
                        foreach (var kvp in dict)
                        {
                            writer.WriteLine(string.Format("{0}：{1}", kvp.Key, kvp.Value));
                        }
                    }

                    if (ex != null)
                    {
                        writer.WriteLine("Excption:");
                        writer.WriteLine("           Message:" + ex.Message);
                        writer.WriteLine("           Source:" + ex.Source);
                        writer.WriteLine("         StackTrace:" + ex.StackTrace);
                    }
                }
            }
            catch
            {
            }
        }
    }
}
