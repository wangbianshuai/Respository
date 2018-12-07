package com.xxd.ha.hystrix.command.integration;


import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.NoCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.integration.ConsumptionStaticResourceVo;

public class StaticResourcesCommand extends NoCacheHystrixCommand {

    QueryStrings queryStrings;

    public StaticResourcesCommand(QueryStrings queryStrings) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("integration"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_INTEGRATION_PLATFORM_BID_STATIC_RESOURCES.getName())));
        this.queryStrings = queryStrings;
    }

    @Override
    protected JSONObject run() throws Exception {
        return run(ApiEnum.API_INTEGRATION_PLATFORM_BID_STATIC_RESOURCES, headers, queryStrings, ConsumptionStaticResourceVo.class);
    }
}
