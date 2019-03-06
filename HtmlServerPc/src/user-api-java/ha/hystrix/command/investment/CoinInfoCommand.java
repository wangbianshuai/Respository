package com.xxd.ha.hystrix.command.investment;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.ha.hystrix.support.NoCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.investment.CoinInfoVo;
import com.xxd.ha.utils.HeaderHelper;

/**
 * @author EvanChou
 * @date 2018-01-22 下午12:51
 */
public class CoinInfoCommand extends NoCacheHystrixCommand {

    private String token;

    private String ua;

    public CoinInfoCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("investment"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_INVESTMENT_PRIZE_COINS.getName())));
        this.token  = token;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        Headers headers = HeaderHelper.createDefaultHeaders()
                .addHeader("token", token)
                .addHeader("User-Agent", ua);
        return run(ApiEnum.API_INVESTMENT_PRIZE_COINS, headers, CoinInfoVo.class);
    }
}
