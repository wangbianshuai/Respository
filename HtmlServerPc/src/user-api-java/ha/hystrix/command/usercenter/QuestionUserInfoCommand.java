package com.xxd.ha.hystrix.command.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.ha.hystrix.support.NoCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.QuestionUserInfoVo;
import com.xxd.ha.utils.HeaderHelper;

/**
 * @author  zhangshengwen on 2018/3/20.
 */
public class QuestionUserInfoCommand extends NoCacheHystrixCommand {

    private String token;

    private String ua;


    public QuestionUserInfoCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_USER_QUESTION_INFOS.getName())));

        this.token = token;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        Headers headers = HeaderHelper.createDefaultHeaders()
                .addHeader("token", token)
                .addHeader("User-Agent", ua);
        JSONObject run = run(ApiEnum.API_USERCENTER_USER_QUESTION_INFOS, headers, QuestionUserInfoVo.class);

        return run.getJSONObject("questionInfos").getJSONObject("data");
    }
}
