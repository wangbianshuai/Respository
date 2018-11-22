class Cache {
    static SetCache(key, data) {
        if (Cache.CacheKeys[key] && Cache.Data[key] !== data) Cache.Data[key] = data;
    }

    static GetCache(key) {
        if (Cache.CacheKeys[key] && Cache.Data[key]) return Cache.Data[key];
        return null;
    }

    static Remove(key) {
        if (Cache.Data[key]) delete Cache.Data[key];
    }

    static Clear() {
        Cache.Data = {};
    }
}

Cache.Data = {};
Cache.CacheKeys = { BizService_GetLink: true }

export default Cache;