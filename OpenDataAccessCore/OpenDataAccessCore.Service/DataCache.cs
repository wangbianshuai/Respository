﻿using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace OpenDataAccessCore.Service
{
    public class DataCache
    {
        public static ConcurrentQueue<ExcelExportData> ExcelExportDataList = new ConcurrentQueue<ExcelExportData>();

        public static ConcurrentQueue<IAsyncResult> AsyncResultList = new ConcurrentQueue<IAsyncResult>();

        public static void CacheExcelExportData(string fileName, List<Dictionary<string, object>> dictList, Dictionary<string, string> headDict)
        {
            ExcelExportDataList.Enqueue(new ExcelExportData() { FileName = fileName, DataList = dictList, HeadDictionary = headDict });

            try
            {
                IAsyncResult result = null;
                if (AsyncResultList.TryDequeue(out result))
                {
                    result.AsyncWaitHandle.Close();
                }

                AsyncResultList.Enqueue(Task.Run(() =>
                {
                    Thread.Sleep(TimeSpan.FromMinutes(20));

                    ExcelExportDataList = new ConcurrentQueue<ExcelExportData>();
                    AsyncResultList = new ConcurrentQueue<IAsyncResult>();
                }));
            }
            catch
            {
            }
        }

        public static ExcelExportData GetExcelExportData(string fileName)
        {
            List<ExcelExportData> list = new List<ExcelExportData>();
            ExcelExportData data = null;
            while (!ExcelExportDataList.IsEmpty && ExcelExportDataList.Count > 0)
            {
                if (ExcelExportDataList.TryDequeue(out data))
                {
                    if (data.FileName.Equals(fileName))
                    {
                        break;
                    }
                    else
                    {
                        list.Add(data);
                    }
                }
                else
                {
                    break;
                }
            }

            if (list.Count > 0)
            {
                list.ForEach(d =>
                {
                    ExcelExportDataList.Enqueue(d);
                });
            }

            return data;
        }

        const string DesKey = "userlogintokedeskey12345";

        static System.Collections.Concurrent.ConcurrentDictionary<Guid, string> _UserTokenDictionary = new System.Collections.Concurrent.ConcurrentDictionary<Guid, string>();
 
        public static bool JudgeToken(Guid userId, string token)
        {
            if (_UserTokenDictionary.ContainsKey(userId))
            {
                if (_UserTokenDictionary[userId].Equals(token))
                {
                    DateTime loginDate = DateTime.Parse(OpenDataAccessCore.Utility.DESEncryptor.HexDecrypt(token, DesKey));
                    if (loginDate.AddDays(1) > DateTime.Now) return true;
                }
            }
            return false;
        }

        public static string AddLoginToken(Guid userId)
        {
            string token = OpenDataAccessCore.Utility.DESEncryptor.HexEncrypt(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), DesKey);
            _UserTokenDictionary.AddOrUpdate(userId, token, (key, value) => { return token; });

            return token;
        }
    }

    public class ExcelExportData
    {
        public string FileName { get; set; }
        public List<Dictionary<string, object>> DataList { get; set; }
        public Dictionary<string, string> HeadDictionary { get; set; }
        public DateTime StartTime { get; set; }

        public ExcelExportData()
        {
            StartTime = DateTime.Now;
        }
    }
}
