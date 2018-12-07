package com.xxd.ha.hystrix.command.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;

/**
 * 退出登录
 */
public class LogoutCommand extends AbstractHystrixCommand<JSONObject> {

    private String token;

    private String ua;

    public LogoutCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_LOGINOUT.getName())));
        this.token = token;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        headers.addHeader("token", token)
                .addHeader("User-Agent", ua);
        return JsonUtil.toJSONObject(HttpClientHelper.post(ApiEnum.API_USERCENTER_LOGINOUT, headers).getData());
    }

    @Override
    protected JSONObject getFallback() {
        return null;
    }
}
