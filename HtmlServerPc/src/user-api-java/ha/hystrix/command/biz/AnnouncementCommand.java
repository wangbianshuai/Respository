package com.xxd.ha.hystrix.command.biz;


import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.ha.hystrix.support.MultiLevelCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.bulletin.BulletinAnnouncementVo;

/**
 * 最新公告
 */
public class AnnouncementCommand extends MultiLevelCacheHystrixCommand {

    public AnnouncementCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("biz"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_BULLETIN_ANNOUNCEMENT.getName())));
    }

    @Override
    protected JSONObject run()  {
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("pageSize", 5)
                .addParameter("currentPage", 1);
        return run(ApiEnum.API_BULLETIN_ANNOUNCEMENT, headers, queryStrings, BulletinAnnouncementVo.class);
    }

}
