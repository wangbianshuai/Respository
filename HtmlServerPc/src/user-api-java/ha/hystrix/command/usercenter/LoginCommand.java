package com.xxd.ha.hystrix.command.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.dto.RequestDTO;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.FormUrlEncoded;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.common.util.CodecUtil;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;

/**
 * 用户登录
 */
public class LoginCommand extends AbstractHystrixCommand<JSONObject> {

    private String name;
    private String password;
    private String ua;

    public LoginCommand(String userName, String password, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_LOGIN.getName())));
        this.name = userName;
        this.password = password;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        headers.addHeader("User-Agent", ua);
        RequestDTO requestDTO = RequestDTO.create()
                .addParameter("userName", name)
                .addParameter("password", CodecUtil.md5Hex(CodecUtil.md5Hex(password)));
        FormUrlEncoded formUrlEncoded = FormUrlEncoded.create()
                .setBody(requestDTO.transform2JsonString());
        return JsonUtil.toJSONObject(HttpClientHelper.post(ApiEnum.API_USERCENTER_LOGIN, headers, formUrlEncoded).getData());
    }

    @Override
    protected JSONObject getFallback() {
        return null;
    }
}
