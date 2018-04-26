using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocketCommunication.SocketCore
{
    public class Common
    {
        /// <summary>
        /// 获取异常对象
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static Exception GetInnerException(Exception ex)
        {
            if (ex.InnerException != null)
            {
                return GetInnerException(ex.InnerException);
            }
            return ex;
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

    }
}
