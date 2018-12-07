package com.xxd.ha.hystrix.command.tradecenter.product;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.MultiLevelCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.product.RRYVo;

import java.math.BigDecimal;

/**
 * 日日盈
 */
public class RryCommand extends MultiLevelCacheHystrixCommand {

    public RryCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_BRIEF_RRY.getName())));
    }

    @Override
    protected JSONObject run() {
        return run(ApiEnum.API_TRADECENTER_BRIEF_RRY, headers, RRYVo.class);
    }

    @Override
    protected void handlerMessage(Message message) {
        JSONObject rry = JsonUtil.toJSONObject(message.getData());
        BigDecimal plannedAnnualRateBigDecimal = rry.getBigDecimal("plannedAnnualRate");
        String plannedAnnualRateFormat = "";
        if (plannedAnnualRateBigDecimal != null) {
            plannedAnnualRateFormat = plannedAnnualRateBigDecimal.divide(new BigDecimal(3.6), 2, BigDecimal.ROUND_DOWN).toString();
        }
        rry.put("plannedAnnualRateFormat", plannedAnnualRateFormat);
    }
}
