package com.xxd.ha.hystrix.command.biz;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.FallbackWithCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.bulletin.BulletinAdVo;

/**
 * 首页轮播图.
 */
public class AdCommand extends FallbackWithCacheHystrixCommand {

    public AdCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("biz"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_BULLETIN_AD.getName())));
    }

    @Override
    protected JSONObject run() {
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("pageSize", 10)
                .addParameter("currentPage", 1);
        return run(ApiEnum.API_BULLETIN_AD, headers, queryStrings, BulletinAdVo.AdData.class);
    }

}
