package com.xxd.ha.hystrix.command.tradecenter.record;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.detail.InvestProductRecordVo;

public class ThirtyTenderInvestmentRecordCommand extends AbstractHystrixCommand<JSONObject> {

    private String reglintstId;


    public ThirtyTenderInvestmentRecordCommand(String reglintstId) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_THIRTY_TENDER_RECORD.getName())));
        this.reglintstId = reglintstId;

    }

    @Override
    protected JSONObject run() throws Exception {
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("reglintstId", reglintstId)
                .addParameter("currentPage", "1")
                .addParameter("pageSize", "10");
        return process(ApiEnum.API_TRADECENTER_THIRTY_TENDER_RECORD, headers, queryStrings, InvestProductRecordVo.class);
    }
}
