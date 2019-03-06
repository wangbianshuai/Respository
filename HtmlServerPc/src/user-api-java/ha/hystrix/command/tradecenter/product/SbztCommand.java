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
import com.xxd.ha.hystrix.vo.tradecenter.product.SBZTVo;
import org.thymeleaf.expression.Numbers;

import java.math.BigDecimal;
import java.util.Locale;

/**
 * 散标直投
 */
public class SbztCommand extends FallbackWithCacheHystrixCommand {

    public SbztCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_BRIEF_SBZT.getName())));
    }

    @Override
    protected JSONObject run() {
        QueryStrings queryStrings = QueryStrings.create().addParameter("currentPage", 0)
                .addParameter("pageSize", 5);
        return run(ApiEnum.API_TRADECENTER_BRIEF_SBZT, headers, queryStrings, SBZTVo.class);
    }

    @Override
    protected void handlerMessage(Message message) {
        JSONObject sbzt = JsonUtil.toJSONObject(message.getData());
        JSONArray array = sbzt.getJSONArray("items"); // 散标直投下面得标

        Numbers numbers = new Numbers(Locale.getDefault());
        for (int i = 0; i < array.size(); i++) {
            JSONObject bid = array.getJSONObject(i);
            BigDecimal leftAmount = bid.getBigDecimal("leftAmount");
            String leftAmountFormat = numbers.formatDecimal(leftAmount, 1, "COMMA", 2, "POINT"); // 剩余金额格式化
            bid.put("leftAmountFormat", leftAmountFormat);
            // 已投资占比： (bidAmount - leftAmount) / bidAmount * 100
            BigDecimal bidAmount = bid.getBigDecimal("bidAmount");
            String percent = numbers.formatInteger(bidAmount.subtract(leftAmount).divide(bidAmount, 10,
                    BigDecimal.ROUND_HALF_DOWN).multiply(new BigDecimal(100)), 0);
            bid.put("percent", percent);
        }
    }
}
