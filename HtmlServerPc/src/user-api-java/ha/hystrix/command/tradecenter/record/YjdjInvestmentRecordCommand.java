package com.xxd.ha.hystrix.command.tradecenter.record;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.FallbackWithCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.detail.InvestProductRecordVo;

/**
 * 月进斗金投资记录
 */
public class YjdjInvestmentRecordCommand extends FallbackWithCacheHystrixCommand {

    private String reglintstId;


    public YjdjInvestmentRecordCommand(String reglintstId) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_YJDJ_RECORD.getName())));
        this.reglintstId = reglintstId;
    }

    @Override
    protected JSONObject run() throws Exception {
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("reglintstId", reglintstId)
                .addParameter("currentPage", "1")
                .addParameter("pageSize", "10");
        return run(ApiEnum.API_TRADECENTER_YJDJ_RECORD, headers, queryStrings, InvestProductRecordVo.class);
    }

}
