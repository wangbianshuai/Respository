package com.xxd.ha.hystrix.command.biz;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.ha.hystrix.support.MultiLevelCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.bulletin.BulletinMoreVo;

/**
 * 了解更多
 */
public class MoreCommand extends MultiLevelCacheHystrixCommand {

    public MoreCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("biz"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_BULLETIN_MORE.getName())));
    }

    @Override
    protected JSONObject run()  {
        return run(ApiEnum.API_BULLETIN_MORE, headers, BulletinMoreVo.class);
    }

}
