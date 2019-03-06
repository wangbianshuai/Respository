package com.xxd.ha.hystrix.command.usercenter.account;

import com.alibaba.fastjson.JSONArray;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.CompanyAccountLoanInfoVo;

import java.util.List;

/**
 * @author liangyuchao
 */
public class CompanyAccountLoanInfoCommand extends AbstractHystrixCommand<List<CompanyAccountLoanInfoVo>> {

    private int userid;

    public CompanyAccountLoanInfoCommand(int userid) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_COMPANYACCOUNT_LOANINFO.getName())));
        this.userid = userid;
    }

    @Override
    protected List<CompanyAccountLoanInfoVo> run() throws Exception {
        QueryStrings qs = QueryStrings.create()
                .addPath("/")
                .addPath(Integer.toString(userid));
        return JsonUtil.toList(HttpClientHelper.get(
                ApiEnum.API_TRADECENTER_COMPANYACCOUNT_LOANINFO, headers, qs).getData(),
                CompanyAccountLoanInfoVo.class);
    }

    @Override
    protected List<CompanyAccountLoanInfoVo> getFallback() {
        return JsonUtil.toList(new JSONArray(), CompanyAccountLoanInfoVo.class);
    }
}
