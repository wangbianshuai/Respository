package com.xxd.ha.hystrix.command.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.enums.MessageStatus;
import com.xxd.ha.hystrix.support.NoCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.AccountUserInfoVo;

/**
 * 用户信息获取 根据token
 */
public class UserInfoByTokenCommand extends NoCacheHystrixCommand {

    private String token;

    private String ua;

    public UserInfoByTokenCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_USERINFO.getName())));
        this.token = token;
        this.ua = ua;
    }

    @Override
    protected void handlerMessage(Message message) {
        message.setCode(MessageStatus.SUCCESS.getStatus());
        message.setData(((JSONObject) message.getData()).get("data"));
    }

    @Override
    protected JSONObject run() {
        headers.addHeader("token", token)
                .addHeader("User-Agent", ua);
        return run(ApiEnum.API_USERCENTER_USERINFO, headers, AccountUserInfoVo.class);
    }

    @Override
    protected JSONObject getFallback() {
        return new JSONObject();
    }
}
