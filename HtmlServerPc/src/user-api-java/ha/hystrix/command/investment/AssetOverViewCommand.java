package com.xxd.ha.hystrix.command.investment;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.ha.hystrix.support.NoCacheHystrixCommand;
import com.xxd.ha.utils.HeaderHelper;
import com.xxd.ha.hystrix.vo.investment.AssetOverviewVo;

/**
 * 资产预览
 */
public class AssetOverViewCommand extends NoCacheHystrixCommand {

    private String token;

    private String ua;

    public AssetOverViewCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("investment"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_INVESTMENT_ASSET_OVERVIEW.getName())));
        this.token  = token;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        Headers headers = HeaderHelper.createDefaultHeaders()
                .addHeader("token", token)
                .addHeader("User-Agent", ua);
        return run(ApiEnum.API_INVESTMENT_ASSET_OVERVIEW, headers, AssetOverviewVo.class);
    }
}
