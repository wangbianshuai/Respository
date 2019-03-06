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
import com.xxd.ha.hystrix.command.tradecenter.detail.ThirtyTenderDetailCommand;
import com.xxd.ha.hystrix.command.tradecenter.detail.ThirtyTenderDetailLoginedCommand;
import com.xxd.ha.hystrix.command.tradecenter.record.ThirtyTenderInvestmentRecordCommand;
import com.xxd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author EvanChou
 * @create 2017-11-17 2:31 PM
 */
@Controller
@RequestMapping("/detail")
public class ThirtyTenderController extends BaseController {

    @Autowired
    UserService userService;

    @RequestMapping("/thirtytender.html")
    public String thirtyTender(Model model) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);
        String agent = HttpHelper.getUserAgent(request);
        JsonUtil.copyValues(jsonObject, new LinkCommand().execute());
        if (userService.isLogin(token, HttpHelper.getUserAgent(request))) {
            JsonUtil.copyValues(jsonObject,
                    new ThirtyTenderDetailLoginedCommand(token, HttpHelper.getUserAgent(request)).execute());
        } else {
            JSONObject temp = new ThirtyTenderDetailCommand().execute();
            JsonUtil.copyValues(jsonObject, temp);
        }

        String id = jsonObject.getJSONObject(ApiEnum.API_TRADECENTER_DETAIL_THIRTY_TENDER_LOGINED.getName()).getJSONObject("data").getString("id");
        JsonUtil.copyValues(jsonObject, new ThirtyTenderInvestmentRecordCommand(id).execute());

        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("formtoken", userService.createFormToken(request));
        jsonObject.put("token", token);
        jsonObject.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        // 资金出借风险提示函文案
        jsonObject.put("projectRiskText", ApolloRemoteConfig.getPropertyValue(ApolloRemoteConfig.PropertiesName.PROJECT_RISK_TEXT.getName()));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        return "detail/thirtytender";
    }

}
