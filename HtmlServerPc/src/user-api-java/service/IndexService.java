package com.xxd.service;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.command.biz.*;
import com.xxd.ha.hystrix.command.tradecenter.product.*;
import org.springframework.stereotype.Service;

/**
 * @author EvanChou.
 * 首页服务
 */
@Service
public class IndexService {

    public JSONObject getIndexGlobalData(JSONObject result) {

        JsonUtil.copyValues(result, new ZqzrCommand().execute());
        JsonUtil.copyValues(result, new SbztCommand().execute());
        JsonUtil.copyValues(result, new ThirtTenderCommand().execute());

        JsonUtil.copyValues(result, new AdCommand().execute());
        JsonUtil.copyValues(result, new AchievementCommand().execute());
        JsonUtil.copyValues(result, new AnnouncementCommand().execute());
        JsonUtil.copyValues(result, new NewsCommand().execute());
        JsonUtil.copyValues(result, new MediaCommand().execute());
        JsonUtil.copyValues(result, new InvestmentRankCommand().execute());
        JsonUtil.copyValues(result, new PartnerCommand().execute());
        JsonUtil.copyValues(result, new MoreCommand().execute());
        JsonUtil.copyValues(result, new LinkCommand().execute());
        JsonUtil.copyValues(result, new YjdjCommand().execute());
        JsonUtil.copyValues(result, new YypCommand().execute());
        JsonUtil.copyValues(result, new XybCommand().execute());

        return result;
    }

}
