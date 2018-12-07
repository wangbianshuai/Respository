package com.xxd.ha.hystrix.command.tradecenter.product;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.ha.hystrix.support.FallbackWithCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.product.YYPVo;

/**
 * 月月派
 */
public class YypCommand extends FallbackWithCacheHystrixCommand {

    public YypCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_BRIEF_YYP.getName())));
    }

    @Override
    protected JSONObject run()  {
        return run(ApiEnum.API_TRADECENTER_BRIEF_YYP, headers, YYPVo.class);
    }
}
