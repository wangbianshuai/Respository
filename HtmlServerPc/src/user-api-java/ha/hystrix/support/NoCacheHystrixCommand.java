package com.xxd.ha.hystrix.support;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.common.remoting.http.parameters.QueryStrings;

public abstract class NoCacheHystrixCommand extends AbstractHystrixCommand<JSONObject> {

    protected NoCacheHystrixCommand(Setter setter) {
        super(setter);
    }

    protected JSONObject run(ApiEnum apiEnum, Headers headers, QueryStrings queryStrings, Class clz) {
        return process(apiEnum, headers, queryStrings, clz);
    }

    protected JSONObject run(ApiEnum apiEnum, Headers headers, Class clz) {
        return run(apiEnum, headers, null, clz);
    }

    @Override
    protected JSONObject getFallback() {
        return null;
    }
}
