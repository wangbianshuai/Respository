using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DataDistribution.Service.Code
{
    public class DataStore
    {
        static ConcurrentDictionary<string, ConcurrentDictionary<long,ConcurrentQueue<byte[]>>> _DataDictionary { get; set; }

        static DataStore()
        {
            _DataDictionary = new ConcurrentDictionary<string, ConcurrentDictionary<long, ConcurrentQueue<byte[]>>>();
        }

        public static bool SetData(string dataKey, List<long> userIdList, byte[] data)
        {
            if (data == null || userIdList == null || userIdList.Count == 0 || string.IsNullOrEmpty(dataKey)) return false;

            ConcurrentDictionary<long, ConcurrentQueue<byte[]>> userDict = null;
            if (!_DataDictionary.ContainsKey(dataKey))
            {
                userDict = new ConcurrentDictionary<long, ConcurrentQueue<byte[]>>();
                _DataDictionary[dataKey] = userDict;
            }
            else userDict = _DataDictionary[dataKey];

            userIdList.ForEach(userId => AddUserData(userId, userDict, data));

            return true;
        }

        static void AddUserData(long userId, ConcurrentDictionary<long, ConcurrentQueue<byte[]>> userDict, byte[] data)
        {
            ConcurrentQueue<byte[]> dataList = null;
            if (userDict.ContainsKey(userId)) dataList = userDict[userId];
            else { dataList = new ConcurrentQueue<byte[]>(); userDict[userId] = dataList; }

            dataList.Enqueue(data);
        }

        public static byte[] GetData(string dataKey, long userId)
        {
            if (_DataDictionary.ContainsKey(dataKey))
            {
                if (_DataDictionary[dataKey].ContainsKey(userId))
                {
                    ConcurrentQueue<byte[]> dataList = _DataDictionary[dataKey][userId];
                    byte[] data = null;
                    if (dataList.TryDequeue(out data)) return data;
                }
            }

            return null;
        }

        public static bool Remove(string dataKey)
        {
            if (_DataDictionary.ContainsKey(dataKey))
            {
                ConcurrentDictionary<long, ConcurrentQueue<byte[]>> userDict = null;
                _DataDictionary.TryRemove(dataKey, out userDict);
            }

            return true;
        }
    }
}