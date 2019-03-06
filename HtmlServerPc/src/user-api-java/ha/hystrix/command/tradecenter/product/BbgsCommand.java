package com.xxd.ha.hystrix.command.tradecenter.product;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.ha.hystrix.support.FallbackWithCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.product.BBGSVo;

/**
 * 步步高升
 */
public class BbgsCommand extends FallbackWithCacheHystrixCommand {

    public BbgsCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_BRIEF_BBGS.getName())));
    }

    @Override
    protected JSONObject run() {
        return run(ApiEnum.API_TRADECENTER_BRIEF_BBGS, headers, null, BBGSVo.class);
    }

}
