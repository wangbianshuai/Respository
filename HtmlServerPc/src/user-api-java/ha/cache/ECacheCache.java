package com.xxd.ha.cache;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cache.CacheManager;

import javax.annotation.Resource;

/**
 * ECache作为一级缓存.
 */
public abstract class ECacheCache implements Cache {

    @Resource
    protected CacheManager cacheManager;

    public JSONObject getValue(String key) {
        org.springframework.cache.Cache.ValueWrapper valueWrapper = lookupCache().get(key);
        if (valueWrapper == null)
            return null;
        return (JSONObject) valueWrapper.get();
    }

    public void evict(String key) {
        lookupCache().evict(key);
    }

    @Override
    public void put(String key, Object value) {
        this.evict(key);
        lookupCache().put(key, value);
    }

    /**
     * 查找指定的缓存.
     * @return
     */
    public abstract org.springframework.cache.Cache lookupCache();
}
