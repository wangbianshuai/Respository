package com.xxd.ha.hystrix.command.usercenter;

import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.exception.TokenException;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;

/**
 * 检查是否登录
 */
public class IsLoginedCommand extends AbstractHystrixCommand<Boolean> {

    private String token;

    private String ua;

    public IsLoginedCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_USER_ISLOGIN.getName())));
        this.token = token;
        this.ua = ua;
    }

    @Override
    protected Boolean run() throws Exception {
        headers.addHeader("token", token)
                .addHeader("User-Agent", ua);
        HttpClientHelper.get(ApiEnum.API_USERCENTER_USER_ISLOGIN, headers);
        return true;
    }

    @Override
    protected Boolean getFallback() {
        Throwable executionException = getExecutionException();
        if (executionException instanceof TokenException){
            throw new TokenException(executionException);
        }
        return false;
    }

}
