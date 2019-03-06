package com.xxd.ha.hystrix.command.tradecenter.detail;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.FallbackWithCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.detail.InvestProductDetailVo;

/**
 * 新手标详情
 */
public class XsbDetailCommand extends FallbackWithCacheHystrixCommand {

    private int month;

    public XsbDetailCommand(int month) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_DETAIL_XSB.getName())));
        this.month = month;
    }

    @Override
    protected JSONObject run() throws Exception {
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("prcode", "XSB" + month);
        return run(ApiEnum.API_TRADECENTER_DETAIL_XSB, headers, queryStrings, InvestProductDetailVo.class);
    }
}
