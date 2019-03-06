package com.xxd.service;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.command.tradecenter.product.*;
import org.springframework.stereotype.Service;

@Service
public class FeApiService {

    /**
     * ApiEnum.API_BRIEF_ZQZR,
     * ApiEnum.API_BRIEF_SBZT,
     * ApiEnum.API_BRIEF_RRY,
     * ApiEnum.API_BRIEF_BBGS,
     * ApiEnum.API_BRIEF_QTDS
     *
     * @return
     */
    public JSONObject getInvokeData() {
        JSONObject result = new JSONObject();
        JsonUtil.copyValues(result, new ZqzrCommand().execute());
        JsonUtil.copyValues(result, new SbztCommand().execute());
        JsonUtil.copyValues(result, new XybCommand().execute());
        JsonUtil.copyValues(result, new BbgsCommand().execute());
        JsonUtil.copyValues(result, new ThirtTenderCommand().execute());
        return result;
    }


}
