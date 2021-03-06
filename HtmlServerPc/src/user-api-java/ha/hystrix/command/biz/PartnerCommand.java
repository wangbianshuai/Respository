package com.xxd.ha.hystrix.command.biz;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.MultiLevelCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.bulletin.BulletinPartnerVo;

/**
 * 合作伙伴
 */
public class PartnerCommand extends MultiLevelCacheHystrixCommand {

    public PartnerCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("biz"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_BULLETIN_PARTNER.getName())));
    }

    @Override
    protected JSONObject run() {
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("pageSize", 10)
                .addParameter("currentPage", 1);
        return run(ApiEnum.API_BULLETIN_PARTNER, headers, queryStrings, BulletinPartnerVo.class);
    }
}
