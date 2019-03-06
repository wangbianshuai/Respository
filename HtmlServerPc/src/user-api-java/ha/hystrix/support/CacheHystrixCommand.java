package com.xxd.ha.hystrix.support;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.extension.spring.SpringApplicationUtil;
import com.xxd.ha.cache.Cache;
import com.xxd.ha.cache.FileCache;
import com.xxd.ha.cache.strategy.ECacheEliminateElementIn1H;
import com.xxd.ha.cache.strategy.ECacheEliminateElementIn5Min;


public abstract class CacheHystrixCommand extends AbstractHystrixCommand<JSONObject> {

    protected ECacheEliminateElementIn5Min eCacheEliminateElementIn5Min
            = SpringApplicationUtil.getBean(ECacheEliminateElementIn5Min.class);

    protected ECacheEliminateElementIn1H eCacheEliminateElementIn1H
            = SpringApplicationUtil.getBean(ECacheEliminateElementIn1H.class);

    protected FileCache fileCache = SpringApplicationUtil.getBean(FileCache.class);

    /**
     * when the cache is not appoint, will be use ECacheEliminateElementIn1H as the default cache strategy.
     */
    protected Cache DEFAULT_CACHE = eCacheEliminateElementIn1H;

    protected FileCache DEFAULT_MOCK_CACHE = fileCache;

    protected CacheHystrixCommand(Setter setter) {
        super(setter);
    }

    protected void appointCache() {

    }
}
