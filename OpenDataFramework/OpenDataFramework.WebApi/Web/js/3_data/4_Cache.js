((ns) => {
    const { Common } = ns.utils

    ns.data.Cache = class Cache {

        static GetDataList(cacheName, entityName, selectNames, conditions) {
            let data = Cache.GetCache(cacheName)
            if (data) return Promise.resolve(data)

            let indexAction = new ns.actions.Index(Cache)
            return indexAction.GetDataList(entityName, selectNames, conditions).then(res => {
                if (res.IsSuccess) {
                    Cache.SetCache(cacheName, entityName, selectNames, conditions, res.Data.DataList)
                    return Promise.resolve(res.Data.DataList)
                }
                else return Promise.resolve(null)
            })
        }

        static GetCache(cacheName) {
            const dataString = Common.GetStorage(cacheName)
            if (!Common.IsNullOrEmpty(dataString)) return JSON.parse(dataString)
            return null
        }

        static SetCache(cacheName, entityName, selectNames, conditions, data) {
            Cache.CacheList = Cache.CacheList || Cache.GetCacheList();
            var list = Cache.CacheList.filter(f => f.CacheName === cacheName);
            if (list.length === 0) Cache.CacheList.push({
                CacheName: cacheName, EntityName: entityName,
                SelectNames: selectNames, Conditions: conditions
            });

            Common.SetStorage("$CacheConfigList", JSON.stringify(Cache.CacheList))

            Common.SetStorage(cacheName, JSON.stringify(data))
        }

        static GetCacheList() {
            return Cache.GetCache("$CacheConfigList") || [];
        }

        static UpdateEntityCacheList(entityName) {
            Cache.CacheList = Cache.CacheList || Cache.GetCacheList();
            let list = Cache.CacheList.filter(f => f.EntityName === entityName);
            list.forEach(c => {
                Common.SetStorage(c.CacheName, "");
                Cache.GetDataList(c.CacheName, c.EntityName, c.SelectNames, c.Conditions);
            })
        }

        static GetPropertyDataList(p) {
            if (!p.DataSource) return;
            const { CacheName, EntityName, SelectNames, Conditions, TextName, ValueName } = p.DataSource;
            p.ValueName = ValueName;
            p.TextName = TextName;
            let cacheName = CacheName || EntityName;
            let condtions = Conditions || [];

            return Cache.GetDataList(cacheName, EntityName, SelectNames, condtions).then(res => {
                p.DataList = res ? res : [];
                let names = Common.Split(p.TextName, [",", ";", "，", "；"]);
                if (names.length > 1) {
                    let text = [];
                    p.DataList.forEach(d => {
                        text = [];
                        names.forEach(n => text.push(Common.IsNullOrEmpty(d[n]) ? "" : d[n]));
                        d[p.TextName] = text.join("/");
                    })
                }
                if (p.ExpandSetDataList) p.DataList = p.ExpandSetDataList(p.DataList, ns);
                return Promise.resolve()
            });
        }
    }

})($ns);