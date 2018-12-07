package com.xxd.web.controller.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.util.CookieUtil;
import com.xxd.common.util.HttpHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.constant.Constant;
import com.xxd.ha.hystrix.command.usercenter.account.AssetStatisticsCommand;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 用户中心投资管理.
 */
@Controller
@RequestMapping("/usercenter/tender")
public class TenderController extends AbstractIsInvestController {

    /**
     * 债券转让
     */
    @RequestMapping(value = "/creditortTansfer.html")
    public String creditortTansfer(Model model) {

        return "usercenter/tender/creditortTansfer";
    }


    /**
     * 新元宝
     */
    @RequestMapping(value = "/goldIngot.html")
    public String goldIngot(Model model) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);
        String ua = HttpHelper.getUserAgent(request);
        JsonUtil.copyValues(globalData, new AssetStatisticsCommand(token, ua).execute());

        return "usercenter/tender/goldIngot";
    }

    /**
     * 散标直投
     */
    @RequestMapping(value = "/investment.html")
    public String investment(Model model) {

        return "usercenter/tender/investment";
    }

    /**
     * 月进斗金.
     */
    @RequestMapping(value = "/monthgold.html")
    public String monthgold(Model model) {

        return "usercenter/tender/monthgold";
    }

    /**
     * 日日盈.
     */
    @RequestMapping(value = "/dayProfit.html")
    public String dayProfit(Model model) {

        return "usercenter/tender/dayProfit";
    }

    /**
    * 七天大胜.
    */
    @RequestMapping(value = "/sevengold.html")
    public String sevengold(Model model) {

        return "usercenter/tender/sevengold";
    }

    /**
     * 月月派.
     */
    @RequestMapping(value = "/monthSend.html")
    public String monthSend(Model model) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);
        String ua = HttpHelper.getUserAgent(request);
        JsonUtil.copyValues(globalData, new AssetStatisticsCommand(token, ua).execute());
        return "usercenter/tender/monthSend";
    }

    /**
     * 新手标.
     */
    @RequestMapping(value = "/newtender.html")
    public String newtender(Model model) {

        return "usercenter/tender/newtender";
    }

    /**
     * 新手专享30天
     */
    @RequestMapping(value = "/thirtytender.html")
    public String thirtytender(Model model) {

        return "usercenter/tender/thirtytender";
    }

    /**
     * 新元宝
     */
    @RequestMapping(value = "/stepDetail.html")
    public String stepDetail(Model model) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);
        String ua = HttpHelper.getUserAgent(request);
        JsonUtil.copyValues(globalData, new AssetStatisticsCommand(token, ua).execute());
        return "usercenter/tender/stepDetail";
    }

}