using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Marriage.Web.Code
{
    public static class Cache
    {
        static ConcurrentDictionary<string, object> _Data { get; set; }
        static ConcurrentDictionary<string, Entity.AppAcountInfo> _AppAccountInfoData { get; set; }

        public static string PageVersion { get; set; }

        static Cache()
        {
            _Data = new ConcurrentDictionary<string, object>();
            _AppAccountInfoData = new ConcurrentDictionary<string, Entity.AppAcountInfo>();
            PageVersion = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
        }

        public static void AddCache(string name, object obj)
        {
            _Data.AddOrUpdate(name, obj, (key, value) => { return obj; });
        }

        public static void AddAppAccountInfo(string pathName, Entity.AppAcountInfo appAcountInfo)
        {
            _AppAccountInfoData.AddOrUpdate(pathName, appAcountInfo, (key, value) => { return appAcountInfo; });
        }

        public static object GetCache(string name)
        {
            if (_Data.ContainsKey(name)) return _Data[name];

            return null;
        }

        public static Entity.AppAcountInfo GetAppAccountInfo(string pathName)
        {
            if (_AppAccountInfoData.ContainsKey(pathName)) return _AppAccountInfoData[pathName];

            return null;
        }
    }
}
