package com.xxd.ha.cache;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.util.JsonUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Component
public class FileCache implements Cache {

    private static final Logger logger = LoggerFactory.getLogger(FileCache.class);

    @Value(value = "classpath:cache.json")
    private Resource resource;

    private ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

    private JSONObject jsonObject = new JSONObject();

    public JSONObject getValueWrapperWithName(String key) {
        return JsonUtil.wrapperDataWithName(key, getValue(key));
    }

    @Override
    public JSONObject getValue(String key) {
        Lock lock = readWriteLock.readLock();
        lock.lock();
        try {
            return jsonObject.getJSONObject(key);
        } finally {
            lock.unlock();
        }
    }

    @Override
    public void put(String key, Object value)  {
        throw new RuntimeException("Illegal operation, put is not support!");
    }

    @PostConstruct
    public void init() {
        Lock lock = readWriteLock.writeLock();
        lock.lock();
        try {
            int len = -1;
            StringBuffer sb = new StringBuffer();
            BufferedReader reader = null;
            try {
                reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));
                String str = "";
                while (StringUtils.isNotEmpty(str = reader.readLine())) {
                    sb.append(str);
                }
                jsonObject = JsonUtil.toJSONObject(sb.toString());
            } catch (IOException e) {
                logger.error("加载mock文件失败", e);
            }
        } finally {
            lock.unlock();
        }
    }
}
