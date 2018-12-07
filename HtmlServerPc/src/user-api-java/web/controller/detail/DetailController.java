package com.xxd.web.controller.detail;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.util.CookieUtil;
import com.xxd.common.util.HttpHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.config.ApolloRemoteConfig;
import com.xxd.constant.Constant;
import com.xxd.web.controller.BaseController;
import com.xxd.ha.hystrix.command.biz.LinkCommand;
import com.xxd.ha.hystrix.command.tradecenter.record.XsbInvestmentRecordCommand;
import com.xxd.ha.hystrix.command.tradecenter.record.YjdjInvestmentRecordCommand;
import com.xxd.ha.hystrix.command.tradecenter.detail.XsbDetailCommand;
import com.xxd.ha.hystrix.command.tradecenter.detail.XsbDetailLoginedCommand;
import com.xxd.ha.hystrix.command.tradecenter.detail.YjdjDetailCommand;
import com.xxd.ha.hystrix.command.tradecenter.detail.YjdjDetailLoginedCommand;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 详情页控制器.
 */
@Controller
@RequestMapping("/detail")
public class DetailController extends BaseController {

    @RequestMapping(value = "/monthgold.html")
    public String monthgold(Model model) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);

        JsonUtil.copyValues(jsonObject, new LinkCommand().execute());
        if (userService.isLogin(token, HttpHelper.getUserAgent(request))) {
            JsonUtil.copyValues(jsonObject, new YjdjDetailLoginedCommand(token, HttpHelper.getUserAgent(request)).execute());
        } else {
            JsonUtil.copyValues(jsonObject, new YjdjDetailCommand().execute());
        }
        String id = jsonObject.getJSONObject(ApiEnum.API_TRADECENTER_DETAIL_YJDJ_LOGINED.getName()).getJSONObject("data").getString("id");

        JsonUtil.copyValues(jsonObject, new YjdjInvestmentRecordCommand(id).execute());
        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("formtoken", userService.createFormToken(request));
        jsonObject.put("token", token);
        jsonObject.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        // 资金出借风险提示函文案
        jsonObject.put("projectRiskText", ApolloRemoteConfig.getPropertyValue(ApolloRemoteConfig.PropertiesName.PROJECT_RISK_TEXT.getName()));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        // 根据用户有么有实名认证跳转对应的页面
        return "detail/monthgold";
    }

    @RequestMapping(value = {"/newtender.html", "newtender-1.html"})
    public String newtender(Model model) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);

        JsonUtil.copyValues(jsonObject, new LinkCommand().execute());

        if (userService.isLogin(token, HttpHelper.getUserAgent(request))) {
            JsonUtil.copyValues(jsonObject, new XsbDetailLoginedCommand(token,  HttpHelper.getUserAgent(request), 1).execute());
        } else {
            JsonUtil.copyValues(jsonObject, new XsbDetailCommand(1).execute());
        }
        String id = jsonObject.getJSONObject(ApiEnum.API_TRADECENTER_DETAIL_XSB_LOGINED.getName()).getJSONObject("data").getString("id");

        JsonUtil.copyValues(jsonObject, new XsbInvestmentRecordCommand(id, 1).execute());

        jsonObject.put("formtoken", userService.createFormToken(request));
        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("token", token);
        jsonObject.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        // 资金出借风险提示函文案
        jsonObject.put("projectRiskText", ApolloRemoteConfig.getPropertyValue(ApolloRemoteConfig.PropertiesName.PROJECT_RISK_TEXT.getName()));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        // 根据用户有么有实名认证跳转对应的页面
        return "detail/newtender";
    }

    /**
     * 新手标3月.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/newtender-3.html")
    public String newtenderThreeMonth(Model model) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);

        JsonUtil.copyValues(jsonObject, new LinkCommand().execute());


        if (userService.isLogin(token, HttpHelper.getUserAgent(request))) {
            JsonUtil.copyValues(jsonObject, new XsbDetailLoginedCommand(token, HttpHelper.getUserAgent(request),3).execute());
        } else {
            JsonUtil.copyValues(jsonObject, new XsbDetailCommand(3).execute());
        }
        String id = jsonObject.getJSONObject(ApiEnum.API_TRADECENTER_DETAIL_XSB_LOGINED.getName()).getJSONObject("data").getString("id");

        JsonUtil.copyValues(jsonObject, new XsbInvestmentRecordCommand(id,3).execute());

        jsonObject.put("formtoken", userService.createFormToken(request));
        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("token", token);
        jsonObject.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        // 资金出借风险提示函文案
        jsonObject.put("projectRiskText", ApolloRemoteConfig.getPropertyValue(ApolloRemoteConfig.PropertiesName.PROJECT_RISK_TEXT.getName()));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        // 根据用户有么有实名认证跳转对应的页面
        return "detail/newtender";
    }

    @RequestMapping(value = "/purchaseSuccess.html")
    public String c(Model model) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);

        JsonUtil.copyValues(jsonObject, new LinkCommand().execute());
        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("token", token);
        jsonObject.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        return "detail/purchaseSuccess";
    }

    @RequestMapping(value = "/investFail.html")
    public String investFail(Model model) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);

        JsonUtil.copyValues(jsonObject, new LinkCommand().execute());
        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("token", token);
        jsonObject.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        return "detail/investFail";
    }

    @RequestMapping(value = "/userProtocol.html")
    public String userProtocol(Model model) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);
        JsonUtil.copyValues(jsonObject, new LinkCommand().execute());
        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("token", token);
        jsonObject.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        return "protocol/userlicenseAgree";
    }


    @RequestMapping(value = "/authorizStatus.html")
    public String authorizStatus(Model model) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);
        JsonUtil.copyValues(jsonObject, new LinkCommand().execute());
        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("token", token);
        jsonObject.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        return "detail/authorizStatus";
    }
}