package com.xxd.ha.hystrix.command.investment;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.ha.hystrix.support.NoCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.investment.RiskExamResultVo;
import com.xxd.ha.utils.HeaderHelper;

/**
 * @author EvanChou
 * @date 2018-01-22 下午6:02
 */
public class RiskExamResultCommand extends NoCacheHystrixCommand {

    String token;

    String ua;

    public RiskExamResultCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("investment"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_INVESTMENT_MORE_RISKEXAM_RESULT.getName())));
        this.token = token;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        Headers headers = HeaderHelper.createDefaultHeaders()
                .addHeader("token", token)
                .addHeader("User-Agent", ua);
        return run(ApiEnum.API_INVESTMENT_MORE_RISKEXAM_RESULT, headers, RiskExamResultVo.class);
    }
}
