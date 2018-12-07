package com.xxd.ha.hystrix.command.tradecenter.product;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.ha.hystrix.support.FallbackWithCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.product.XYBVo;

/**
 * 新元宝
 */
public class XybCommand extends FallbackWithCacheHystrixCommand {

    public XybCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_BRIEF_XYB.getName())));
    }

    @Override
    protected JSONObject run()  {
        return run(ApiEnum.API_TRADECENTER_BRIEF_XYB, headers, XYBVo.class);
    }
}
