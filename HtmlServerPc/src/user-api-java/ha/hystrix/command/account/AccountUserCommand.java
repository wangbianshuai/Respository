package com.xxd.ha.hystrix.command.account;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.exception.ServiceException;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.enums.BizStatusEnum;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.utils.HeaderHelper;

/**
 * 当前登录用户信息
 */
public class AccountUserCommand extends AbstractHystrixCommand<JSONObject> {

    private String userToken;

    private String ua;

    public AccountUserCommand(String userToken,String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("account"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_ACCOUNT_USERINFO.getName())));
        this.userToken = userToken;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        Headers headers = HeaderHelper.createDefaultHeaders()
        .addHeader("User-Agent",ua);
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("userToken",userToken);
        Message message = HttpClientHelper.post(ApiEnum.API_ACCOUNT_USERINFO, headers, queryStrings);
        if (message == null)
            throw new ServiceException(BizStatusEnum.BIZ_ERROR.getStatus(), "获取用户信息失败");
        return JsonUtil.toJSONObject(message.getData());
    }

    @Override
    protected JSONObject getFallback() {
        return null;
    }
}
