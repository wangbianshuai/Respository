package com.xxd.ha.hystrix.command.investment;

import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.utils.HeaderHelper;

/**
 * 用户购买状态
 */
public class InvestStatusCommand extends AbstractHystrixCommand<Boolean> {

    private String token;

    private String ua;

    public InvestStatusCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("investment"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_USER_INVESTSTATUS.getName())));
        this.token = token;
        this.ua = ua;
    }


    @Override
    protected Boolean run() throws Exception {
        Headers headers = HeaderHelper.createDefaultHeaders()
                .addHeader("token", token)
                .addHeader("User-Agent", ua);
        Message message = HttpClientHelper.post(ApiEnum.API_USERCENTER_USER_INVESTSTATUS, headers);
        return (Boolean) message.getData();
    }

    @Override
    protected Boolean getFallback() {
        return Boolean.FALSE;
    }
}
