package com.xxd.ha.hystrix.command.tradecenter.product;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.FallbackWithCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.product.ThirtyTenderVo;
import org.thymeleaf.expression.Numbers;

import java.util.Locale;

/**
 * 30天新手产品
 */
public class ThirtTenderCommand extends FallbackWithCacheHystrixCommand {

    public ThirtTenderCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_BRIEF_THIRTY.getName())));
    }

    @Override
    protected JSONObject run() {
        return run(ApiEnum.API_TRADECENTER_BRIEF_THIRTY, headers, ThirtyTenderVo.class);
    }

    @Override
    protected void handlerMessage(Message message) {
        JSONObject qtds = JsonUtil.toJSONObject(message.getData());
        Numbers numbers = new Numbers(Locale.getDefault());
        String floatingRateFormat = numbers.formatInteger(qtds.getBigDecimal("floatingRate"), 0);
        qtds.put("floatingRateFormat", floatingRateFormat);
    }
}
