package com.xxd.ha.hystrix.command.tradecenter.product;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.FallbackWithCacheHystrixCommand;
import com.xxd.ha.hystrix.support.MultiLevelCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.product.ZQZRVo;
import org.thymeleaf.expression.Numbers;

import java.math.BigDecimal;
import java.util.Locale;

/**
 * 债权转让
 */
public class ZqzrCommand extends FallbackWithCacheHystrixCommand {

    public ZqzrCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_BRIEF_ZQZR.getName())));
    }

    @Override
    protected JSONObject run() {
        QueryStrings queryStrings = QueryStrings.create().addParameter("currentPage", 0)
                .addParameter("pageSize", 5);
        return run(ApiEnum.API_TRADECENTER_BRIEF_ZQZR, headers, queryStrings, ZQZRVo.class);
    }

    @Override
    protected void handlerMessage(Message message) {
        JSONObject zqzr = JsonUtil.toJSONObject(message.getData());
        // 转让标
        JSONArray zqzrArry = zqzr.getJSONArray("items");
        Numbers numbers = new Numbers(Locale.getDefault());
        for (int i = 0; i < zqzrArry.size(); i++) {
            JSONObject bid = zqzrArry.getJSONObject(i);
            BigDecimal leftAmount = bid.getBigDecimal("transferPrice");
            // 剩余金额格式化
            String transferPriceFormat = numbers.formatDecimal(leftAmount, 1, "COMMA", 2, "POINT");
            bid.put("transferPriceFormat", transferPriceFormat);
        }
    }
}



