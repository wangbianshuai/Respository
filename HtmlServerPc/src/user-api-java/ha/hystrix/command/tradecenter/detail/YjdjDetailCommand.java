package com.xxd.ha.hystrix.command.tradecenter.detail;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.FallbackWithCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.detail.InvestProductDetailVo;

/**
 * 月进斗金详情
 */
public class YjdjDetailCommand extends FallbackWithCacheHystrixCommand {

    public YjdjDetailCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_DETAIL_YJDJ.getName())));
    }

    @Override
    protected JSONObject run() throws Exception {
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("prcode", "YJDJ");
        return process(ApiEnum.API_TRADECENTER_DETAIL_YJDJ, headers, queryStrings, InvestProductDetailVo.class);
    }
}
