package com.xxd.ha.hystrix.command.usercenter.account;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.CompanyAccountDetailInfoVo;

/**
 * @author liangyuchao
 */
public class CompanyAccountDetailInfoCommand extends AbstractHystrixCommand<CompanyAccountDetailInfoVo> {

    private int userid;

    public CompanyAccountDetailInfoCommand(int userid) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_COMPANYACCOUNT_DETAILINFO.getName())));
        this.userid = userid;
    }

    @Override
    protected CompanyAccountDetailInfoVo run() throws Exception {
        QueryStrings qs = QueryStrings.create()
                .addPath("/")
                .addPath(Integer.toString(userid));
        return JsonUtil.toObject(HttpClientHelper.get(
                ApiEnum.API_TRADECENTER_COMPANYACCOUNT_DETAILINFO, headers, qs).getData(),
                CompanyAccountDetailInfoVo.class);
    }

    @Override
    protected CompanyAccountDetailInfoVo getFallback() {
        return JsonUtil.toObject(new JSONObject(), CompanyAccountDetailInfoVo.class);
    }
}
