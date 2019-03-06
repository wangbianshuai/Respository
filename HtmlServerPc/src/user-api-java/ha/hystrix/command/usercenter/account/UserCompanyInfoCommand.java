package com.xxd.ha.hystrix.command.usercenter.account;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.UserCompanyInfoVO;

/**
 *
 * @author zhangshengwen
 * @date 2018/1/9
 */
public class UserCompanyInfoCommand extends AbstractHystrixCommand<UserCompanyInfoVO> {

    private String token;

    private String ua;

    public UserCompanyInfoCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_USER_QUERYUSERCOMPANYINFO.getName())));
        this.token = token;
        this.ua = ua;
    }

    @Override
    protected UserCompanyInfoVO run() throws Exception {
        headers.addHeader("token", token)
                .addHeader("User-Agent", ua);
        return JsonUtil.toJSONObject(HttpClientHelper.get(
                ApiEnum.API_USERCENTER_USER_QUERYUSERCOMPANYINFO, headers).getData())
                .getObject("data", UserCompanyInfoVO.class);
    }

    @Override
    protected UserCompanyInfoVO getFallback() {
        return JsonUtil.toObject(new JSONObject(),UserCompanyInfoVO.class);
    }
}
