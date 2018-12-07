package com.xxd.ha.cache.strategy;

import com.xxd.ha.cache.ECacheCache;
import org.springframework.cache.Cache;
import org.springframework.stereotype.Component;

@Component
public class ECacheEliminateElementIn5Min extends ECacheCache {

    @Override
    public Cache lookupCache() {
       return cacheManager.getCache("5Min");
    }
}
