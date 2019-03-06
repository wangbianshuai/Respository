package com.xxd.ha.hystrix.command.tradecenter.detail;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.detail.InvestProductDetailVo;
import com.xxd.ha.utils.HeaderHelper;

import java.text.DecimalFormat;

/**
 * 30天新手产品  登陆状态下详情
 */
public class ThirtyTenderDetailLoginedCommand extends AbstractHystrixCommand<JSONObject> {

    private String token;

    private String ua;

    public ThirtyTenderDetailLoginedCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_DETAIL_THIRTY_TENDER_LOGINED.getName())));
        this.token = token;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        Headers headers = HeaderHelper.createDefaultHeaders()
                .addHeader("token", token)
                .addHeader("User-Agent", ua);
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("prcode", "XSCP30T");
        return process(ApiEnum.API_TRADECENTER_DETAIL_THIRTY_TENDER_LOGINED, headers, queryStrings, InvestProductDetailVo.class);
    }


    @Override
    protected void handlerMessage(Message message) {
        JSONObject data = JsonUtil.toJSONObject(message.getData());
        Double apr = data.getDouble("apr");

        float income100 = 0f;
        float income1000 = 0f;
        float income5000 =0f;
        float income10000 =0f;

        if (apr != null) {
            Double apr100 = apr  / 12.0;
            Double apr1000 = apr * 10 / 12.0;
            Double apr5000 = apr * 50 / 12.0;
            Double apr10000 = apr *100 / 12.0;
            income100 += (int)(apr100*100)/100.00f;
            income1000 += (int)(apr1000*100)/100.00f;
            income5000 += (int)(apr5000*100)/100.00f;
            income10000 += (int)(apr10000*100)/100.00f;

        }
        Double floatApr = data.getDouble("floatApr");
        if (floatApr != null) {

            Double floatApr100 = floatApr  / 12.0;
            Double floatApr1000 = floatApr * 10 / 12.0;
            Double floatApr5000 = floatApr * 50 / 12.0;
            Double floatApr10000 = floatApr *100 / 12.0;

            income100 += (int)(floatApr100*100)/100.00f;
            income1000 += (int)(floatApr1000*100)/100.00f;
            income5000 += (int)(floatApr5000*100)/100.00f;
            income10000 += (int)(floatApr10000*100)/100.00f;
        }

        data.put("income100", (int)(income100*100)/100.00f);
        data.put("income1000", (int)(income1000*100)/100.00f);
        data.put("income5000", (int)(income5000*100)/100.00f);
        data.put("income10000", (int)(income10000*100)/100.00f);
    }

    @Override
    protected JSONObject getFallback() {
        return new JSONObject();
    }
}
