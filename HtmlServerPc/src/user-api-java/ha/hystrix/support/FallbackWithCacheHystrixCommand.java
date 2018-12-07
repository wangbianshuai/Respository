package com.xxd.ha.hystrix.support;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.common.remoting.http.parameters.QueryStrings;

public abstract class FallbackWithCacheHystrixCommand extends CacheHystrixCommand {

    protected FallbackWithCacheHystrixCommand(Setter setter) {
        super(setter);
    }

    protected JSONObject run(ApiEnum apiEnum, Headers headers, QueryStrings queryStrings, Class clz) {

        JSONObject result = process(apiEnum, headers, queryStrings, clz);

        appointCache();

        this.DEFAULT_CACHE.put(getCommandKey().name(), result);
        return result;
    }

    protected JSONObject run(ApiEnum apiEnum, Headers headers, Class clz) {
        return run(apiEnum, headers, null, clz);
    }

    @Override
    public JSONObject getFallback() {
        appointCache();

        JSONObject data = (JSONObject) this.DEFAULT_CACHE.getValue(getCommandKey().name());
        if (null != data) {
            return data;
        }

        return this.DEFAULT_MOCK_CACHE.getValueWrapperWithName(getCommandKey().name());

    }
}
