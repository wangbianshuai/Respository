package com.xxd.ha.hystrix.command.usercenter.account;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.UserDetailInfoVo;

/**
 *
 * @author zhangshengwen
 * @date 2018/1/9
 */
public class UserDetailInfoCommand extends AbstractHystrixCommand<JSONObject> {

    private String token;

    private String ua;

    public UserDetailInfoCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_USER_INFOFORPC.getName())));
        this.token = token;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        headers.addHeader("token", token)
                .addHeader("User-Agent", ua);
        return process(ApiEnum.API_USERCENTER_USER_INFOFORPC, headers, UserDetailInfoVo.class);
    }

    @Override
    protected JSONObject getFallback() {
        return new JSONObject();
    }
}
