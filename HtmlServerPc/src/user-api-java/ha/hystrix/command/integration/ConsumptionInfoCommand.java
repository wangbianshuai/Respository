package com.xxd.ha.hystrix.command.integration;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.NoCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.integration.ConsumptionBorrowInfoVo;

/**
 * 借款人信息
 */
public class ConsumptionInfoCommand extends NoCacheHystrixCommand {

    private String bidCode;

    public ConsumptionInfoCommand(String bidCode) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("integration"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_INTEGRATION_PLATFORM_BID_BORROWER_INFO.getName())));
        this.bidCode = bidCode;
    }
    @Override
    protected JSONObject run() throws Exception {
        QueryStrings queryStrings = QueryStrings.create()
                .addPath("/"+bidCode+"/borrower");
        return run(ApiEnum.API_INTEGRATION_PLATFORM_BID_BORROWER_INFO, headers, queryStrings, ConsumptionBorrowInfoVo.class);
    }

}
