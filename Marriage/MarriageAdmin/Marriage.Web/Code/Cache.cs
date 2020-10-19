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
        public static string PageVersion { get; set; }

        static Cache()
        {
            _Data = new ConcurrentDictionary<string, object>();
            PageVersion = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
        }

        public static void AddCache(string name, object obj)
        {
            _Data.AddOrUpdate(name, obj, (key, value) => { return obj; });
        }

        public static object GetCache(string name)
        {
            if (_Data.ContainsKey(name)) return _Data[name];

            return null;
        }
    }
}
