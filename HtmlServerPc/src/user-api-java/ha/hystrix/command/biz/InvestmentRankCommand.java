package com.xxd.ha.hystrix.command.biz;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.MultiLevelCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.bulletin.BulletinInvestmentRankVo;

/**
 * 投资风云榜
 */
public class InvestmentRankCommand extends MultiLevelCacheHystrixCommand {


    public InvestmentRankCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("biz"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_BULLETIN_INVESTMENT_RANK.getName())));
    }

    @Override
    protected JSONObject run() {
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("pageSize", 5)
                .addParameter("currentPage", 1);
        return run(ApiEnum.API_BULLETIN_INVESTMENT_RANK, headers, queryStrings, BulletinInvestmentRankVo.class);
    }

    @Override
    protected void appointCache() {
        this.DEFAULT_CACHE = this.eCacheEliminateElementIn5Min;
    }
}
