/**
 * Copyright (c) 2015, www.xinxindai.com All Rights Reserved.
 */
package com.xxd.web.controller;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.util.CookieUtil;
import com.xxd.common.util.HttpHelper;
import com.xxd.config.ApolloRemoteConfig;
import com.xxd.constant.Constant;
import com.xxd.service.IndexService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Date;

@Controller
public class IndexController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(IndexController.class);

    @Autowired
    IndexService indexService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index(Model model) {

        JSONObject result = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);
        result.put("currentDate", new Date());
        result.put("time", System.currentTimeMillis());
        result.put("token", token);
        result.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        result.put("isPurchased", userService.getInvestStatus(token, HttpHelper.getUserAgent(request)));
        result.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        model.addAttribute("globalData", indexService.getIndexGlobalData(result));
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());

        return "home/index";
    }
}