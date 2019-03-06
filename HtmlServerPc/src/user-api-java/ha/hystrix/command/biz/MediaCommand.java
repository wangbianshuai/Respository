package com.xxd.ha.hystrix.command.biz;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.MultiLevelCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.bulletin.BulletinMediaVo;

/**
 *  媒体报道
 */
public class MediaCommand extends MultiLevelCacheHystrixCommand {

    public MediaCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("biz"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_BULLETIN_MEDIA.getName())));
    }

    @Override
    protected JSONObject run()  {
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("pageSize", 8)
                .addParameter("currentPage", 1);
        return run(ApiEnum.API_BULLETIN_MEDIA, headers, queryStrings, BulletinMediaVo.class);
    }

}
