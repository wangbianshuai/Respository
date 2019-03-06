package com.xxd.ha.hystrix.command.integration;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.NoCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.integration.ConsumptionListVo;

/**
 * 消费贷列表.
 */
public class ConsumptionListCommand extends NoCacheHystrixCommand {

    public ConsumptionListCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("integration"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_INTEGRATION_PLATFORM_BIDS.getName())));
    }

    @Override
    protected JSONObject run() throws Exception {

        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("keyType", "3")
                .addParameter("status", "[\"BIDDING\", \"SATISFIED_BID\", \"REPAYING\", \"REPAY_OVER\"]")
                .addParameter("productCategory", "P001")
                .addParameter("currentPage", "1")
                .addParameter("pageSize", "10");
        return run(ApiEnum.API_INTEGRATION_PLATFORM_BIDS, headers, queryStrings, ConsumptionListVo.class);
    }
}
