using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace UdpServiceTest
{
    public class Common
    {
        public static Exception GetInnerException(Exception ex)
        {
            if (ex.InnerException != null)
            {
                return GetInnerException(ex.InnerException);
            }
            return ex;
        }

        public static void SaveFile(byte[] bytes, string fileName)
        {
            using (FileStream fs = new FileStream(fileName, FileMode.Create, FileAccess.Write))
            {
                fs.Write(bytes, 0, bytes.Length);
                fs.Close();
            }
        }

        public static string InitDirPath(string dirPath)
        {
            if (!Directory.Exists(dirPath)) Directory.CreateDirectory(dirPath);
            return dirPath;
        }

        public static string GetLocalIPAddress()
        {
            IPHostEntry ipe = Dns.GetHostEntry(Dns.GetHostName());
            IPAddress[] ip = ipe.AddressList;
            for (int i = 0; i < ip.Length; i++)
            {
                if (ip[i].AddressFamily.ToString().Equals("InterNetwork")) return ip[i].ToString();
            }
            return null;
        }

        public static List<List<T>> ListToBatchList<T>(List<T> list, int num)
        {
            List<List<T>> batchList = new List<List<T>>();
            List<T> list2 = null;

            int count = list.Count % num == 0 ? list.Count / num : list.Count / num + 1;

            for (int i = 1; i <= count; i++)
            {
                list2 = new List<T>();

                for (int j = (i - 1) * num; j < i * num; j++) if (j < list.Count) list2.Add(list[j]);

                batchList.Add(list2);
            }

            return batchList;
        }

        public static List<T[]> ArrayToBatchList<T>(T[] arrs, int num, Func<int, int, int, T[]> initArray = null, int initStartIndex = 0)
        {
            List<T[]> batchList = new List<T[]>();
            T[] arrs2 = null;

            int count = arrs.Length % num == 0 ? arrs.Length / num : arrs.Length / num + 1;
            int len = 0;
            int startIndex = 0;

            for (int i = 1; i <= count; i++)
            {
                startIndex = (i - 1) * num;
                len = i == count ? arrs.Length - startIndex : num;
                arrs2 = initArray == null ? new T[len] : initArray(i, count, len);

                for (int j = startIndex; j < i * num; j++) if (j < arrs.Length) arrs2[j - startIndex + initStartIndex] = arrs[j];

                batchList.Add(arrs2);
            }

            return batchList;
        }

        public static void ConcurrentStackRemove<T>(ConcurrentStack<T> list, T obj)
        {
            T item = default(T);

            List<T> list2 = new List<T>();

            while (!list.IsEmpty && list.Count > 0)
            {
                if (list.TryPop(out item))
                {
                    if (obj.Equals(item)) break;
                    else list2.Add(item);
                }
                else break;
            }

            if (list2.Count > 0)
            {
                list2.Reverse();
                list2.ForEach(d => list.Push(d));
            }
        }
    }
}
