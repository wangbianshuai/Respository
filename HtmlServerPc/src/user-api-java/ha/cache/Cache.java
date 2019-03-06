package com.xxd.ha.cache;

/**
 * 统一缓存服务访问接口.
 */
public interface Cache {

    Object getValue(String key);

    void put(String key, Object value);
}
