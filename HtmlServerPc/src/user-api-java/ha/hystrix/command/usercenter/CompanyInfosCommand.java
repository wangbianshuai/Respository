package com.xxd.ha.hystrix.command.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.CompanyInfos;
import org.apache.commons.lang3.StringUtils;

/**
 * @author EvanChou
 * @date 2018-02-02 下午4:16
 */
public class CompanyInfosCommand extends AbstractHystrixCommand<JSONObject> {

    String token;

    String ua;

    String id;

    public CompanyInfosCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_USER_COMPANY_INFOS.getName())));
        this.token = token;
        this.ua = ua;
    }

    public CompanyInfosCommand(String token, String ua, String id) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_USER_COMPANY_INFOS.getName())));
        this.token = token;
        this.ua = ua;
        this.id = id;
    }

    @Override
    protected JSONObject run() throws Exception {
        headers.addHeader("token", token)
                .addHeader("User-Agent", ua);
        QueryStrings queryStrings = QueryStrings.create();
        if (StringUtils.isNotBlank(id)) {
            queryStrings.addParameter("id", id);
        }
        return process(ApiEnum.API_USERCENTER_USER_COMPANY_INFOS, headers, queryStrings, CompanyInfos.class);
    }
}
