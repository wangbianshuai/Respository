package com.xxd.ha.hystrix.command.tradecenter.detail;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.detail.InvestProductDetailVo;
import com.xxd.ha.utils.HeaderHelper;

/**
 * 新手标详情  登陆状态下详情
 */
public class XsbDetailLoginedCommand extends AbstractHystrixCommand<JSONObject> {

    private int month;

    private String token;

    private String ua;

    public XsbDetailLoginedCommand(String token, String ua, int month) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_DETAIL_XSB_LOGINED.getName())));
        this.month = month;
        this.ua = ua;
        this.token = token;
    }

    @Override
    protected JSONObject run() throws Exception {
        Headers headers = HeaderHelper.createDefaultHeaders()
                .addHeader("token", token)
                .addHeader("User-Agent", ua);
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("prcode", "XSB" + month);
        return process(ApiEnum.API_TRADECENTER_DETAIL_XSB_LOGINED, headers, queryStrings, InvestProductDetailVo.class);
    }

    @Override
    protected JSONObject getFallback() {
        return new JSONObject();
    }
}
