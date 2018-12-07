package com.xxd.ha.hystrix.command.usercenter.account;


import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.extension.spring.UrlProperties;
import com.xxd.common.remoting.http.async.GetCallable;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;

public class MembershipCommand extends AbstractHystrixCommand<JSONObject> {

    private String token;

    private String ua;


    public MembershipCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey("membership")));
        this.token = token;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        headers.addHeader("token", token)
                .addHeader("User-Agent", ua);

        String url = UrlProperties.getProperty("api.tradecenter.membership");
        JSONObject result = new GetCallable("membership", url, headers).call();
        return result;
    }
}
