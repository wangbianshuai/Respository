package com.xxd.ha.hystrix.command.integration;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.NoCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.integration.ConsumptionDetailVo;
import com.xxd.ha.hystrix.vo.usercenter.QuestionUserInfoVo;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * 消费贷详情.
 */
public class ConsumptionDetailCommand extends NoCacheHystrixCommand {


    private String bidCode;

    private QuestionUserInfoVo questionUserInfoVo;

    public ConsumptionDetailCommand(QuestionUserInfoVo questionUserInfoVo, String bidCode) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("integration"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_INTEGRATION_PLATFORM_BID_DETAIL.getName())));
        this.bidCode = bidCode;
        this.questionUserInfoVo = questionUserInfoVo;
    }

    @Override
    protected JSONObject run() throws Exception {
        QueryStrings queryStrings = QueryStrings.create().addPath("/" + bidCode);
        return run(ApiEnum.API_INTEGRATION_PLATFORM_BID_DETAIL, headers, queryStrings, ConsumptionDetailVo.class);
    }

    @Override
    protected void handlerMessage(Message message) {
        JSONObject data = (JSONObject) message.getData();
        // 计算已经投资所占百分比
        double bidAmount = data.getDouble("bidAmount");
        double leftTenderAmount = data.getDouble("leftTenderAmount");
        double d = (bidAmount - leftTenderAmount) / bidAmount * 100;
        if (bidAmount == 0) {
            d = 0;
        }
        BigDecimal bigDecimal = new BigDecimal(d);
        bigDecimal.setScale(0, RoundingMode.HALF_DOWN);
        data.put("percent", bigDecimal.intValue());

        if (questionUserInfoVo != null) {
            data.put("count", questionUserInfoVo.getCount());
            data.put("nextTestTime", questionUserInfoVo.getNextTestTime());
            data.put("quota", questionUserInfoVo.getQuota());
            data.put("sumCount", questionUserInfoVo.getSumCount());
            data.put("surplusAmount", questionUserInfoVo.getSurplusAmount());
            data.put("testCount", questionUserInfoVo.getTestCount());
            data.put("typeName", questionUserInfoVo.getTypeName());
        }
    }
}
