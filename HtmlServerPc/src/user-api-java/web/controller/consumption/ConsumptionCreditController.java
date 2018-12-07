package com.xxd.web.controller.consumption;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.util.CookieUtil;
import com.xxd.common.util.HttpHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.config.ApolloRemoteConfig;
import com.xxd.constant.Constant;
import com.xxd.ha.hystrix.command.usercenter.QuestionUserInfoCommand;
import com.xxd.ha.hystrix.vo.usercenter.QuestionUserInfoVo;
import com.xxd.web.controller.BaseController;
import com.xxd.ha.hystrix.command.biz.LinkCommand;
import com.xxd.ha.hystrix.command.integration.BidInfoDisclosuresCommand;
import com.xxd.ha.hystrix.command.integration.ConsumptionDetailCommand;
import com.xxd.ha.hystrix.command.integration.ConsumptionInfoCommand;
import com.xxd.ha.hystrix.command.integration.ConsumptionListCommand;
import com.xxd.ha.hystrix.command.investment.AssetOverViewCommand;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 消费贷.
 */
@Controller
@RequestMapping("/detail/")
public class ConsumptionCreditController extends BaseController {

    @RequestMapping(value = "consumptionList.html")
    public String consumption(Model model) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);
        JsonUtil.copyValues(jsonObject, new LinkCommand().execute());

        JsonUtil.copyValues(jsonObject, new ConsumptionListCommand().execute());
        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("token", token);
        jsonObject.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());


        return "/consumption/consumptionList";
    }

    @RequestMapping(value = "/consumption/{bidCode}.html")
    public String detail(Model model, @PathVariable String bidCode) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);

        boolean isLogin = userService.isLogin(token, HttpHelper.getUserAgent(request));
        QuestionUserInfoVo questionUserInfoVo = null;
        if (isLogin) {
            JSONObject assetOverViewObj = new AssetOverViewCommand(token, HttpHelper.getUserAgent(request)).execute();
            JsonUtil.copyValues(jsonObject, assetOverViewObj);

            JSONObject execute = new QuestionUserInfoCommand(token, HttpHelper.getUserAgent(request)).execute();
            questionUserInfoVo = JsonUtil.toObject(execute, QuestionUserInfoVo.class);

            try {
                String surplusAmount = String.valueOf(Float.valueOf(questionUserInfoVo.getQuota()) - Float.valueOf(assetOverViewObj.getJSONObject("overview").getJSONObject("data").getString("investmentAmount")));
                questionUserInfoVo.setSurplusAmount(surplusAmount);
            }catch (Exception e){
                if (questionUserInfoVo == null)
                    questionUserInfoVo = new QuestionUserInfoVo();
                questionUserInfoVo.setSurplusAmount("");
            }

        }

        JsonUtil.copyValues(jsonObject, new LinkCommand().execute());

        // 借款信息
        JsonUtil.copyValues(jsonObject, new ConsumptionDetailCommand(questionUserInfoVo, bidCode).execute());

        // 借款人信息
        JsonUtil.copyValues(jsonObject, new ConsumptionInfoCommand(bidCode).execute());



        // 借款人借款金额未超过20万的提示文案
        jsonObject.put("managementText", ApolloRemoteConfig.getPropertyValue(ApolloRemoteConfig.PropertiesName.MANAGEMENT_TEXT.getName()));
        // 资金出借风险提示函文案
        jsonObject.put("projectRiskText", ApolloRemoteConfig.getPropertyValue(ApolloRemoteConfig.PropertiesName.PROJECT_RISK_TEXT.getName()));
        // 还款保障措施文案
        jsonObject.put("guaranteeText", ApolloRemoteConfig.getPropertyValue(ApolloRemoteConfig.PropertiesName.GUARANTEE_TEXT.getName()));
        // 标的信息披露
        JsonUtil.copyValues(jsonObject, new BidInfoDisclosuresCommand(bidCode).execute());

        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("token", token);
        jsonObject.put("isLogin", isLogin);
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        return "/consumption/consumptionDetail";
    }
}
