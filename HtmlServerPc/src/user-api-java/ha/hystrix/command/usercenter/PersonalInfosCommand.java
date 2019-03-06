package com.xxd.ha.hystrix.command.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.PersonalInfosVo;

/**
 * 用户固定资产，私营业主，财务状况，联系方式.
 * @author EvanChou
 * @date 2018-01-26 下午5:17
 */
public class PersonalInfosCommand extends AbstractHystrixCommand<JSONObject> {

    String ua;

    String token;

    public PersonalInfosCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_PERSONALINFOS.getName())));
        this.token = token;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        headers.addHeader("token", token).addHeader("User-Agent", ua);
        return process(ApiEnum.API_USERCENTER_PERSONALINFOS, headers, PersonalInfosVo.class);
    }
}
