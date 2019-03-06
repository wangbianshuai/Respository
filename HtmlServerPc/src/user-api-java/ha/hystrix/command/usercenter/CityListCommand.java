package com.xxd.ha.hystrix.command.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.CityListVo;

/**
 * 查询城市列表
 * @author EvanChou
 * @date 2018-01-26 上午11:13
 */
public class CityListCommand extends AbstractHystrixCommand<JSONObject> {

    /**
     *  省份code
     */
    String provinceCode;

    public CityListCommand(String provinceCode) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_CITYLIST.getName())));
        this.provinceCode = provinceCode;
    }

    @Override
    protected JSONObject run() throws Exception {
        QueryStrings queryStrings = QueryStrings.create().addParameter("code", provinceCode);
        return process(ApiEnum.API_USERCENTER_CITYLIST, headers, queryStrings, CityListVo.class);
    }
}
