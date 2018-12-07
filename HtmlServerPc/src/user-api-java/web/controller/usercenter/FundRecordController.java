package com.xxd.web.controller.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.util.HttpHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.command.investment.AssetOverViewCommand;
import com.xxd.ha.hystrix.command.investment.CoinInfoCommand;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/usercenter/fundRecord")
public class FundRecordController extends AbstractIsInvestController {


    /**
     * 资金记录
     * @return
     */
    @RequestMapping(value = "/dealDetail.html")
    public String dealDetail(Model model) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        String token = globalData.get("token").toString();
        String ua = HttpHelper.getUserAgent(request);
        JsonUtil.copyValues(globalData, new AssetOverViewCommand(token, ua).execute());
        return "usercenter/fundRecord/dealDetail";
    }

    /**
     * 新新币记录.
     * @return
     */
    @RequestMapping(value = "/coinLog.html")
    public String coinLog(Model model) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        String token = globalData.get("token").toString();
        String ua = HttpHelper.getUserAgent(request);
        JsonUtil.copyValues(globalData, new CoinInfoCommand(token, ua).execute());
        JsonUtil.copyValues(globalData, new AssetOverViewCommand(token, ua).execute());

        return "usercenter/fundRecord/coinLog";
    }

    /**
     * 存管开户.
     * @return
     */
    @RequestMapping(value = "/openAccount.html")
    public String openAccount() {

        return "usercenter/fundRecord/openAccount";
    }

    /**
     * 充值.
     * @return
     */
    @RequestMapping(value = "/recharge.html")
    public String recharge() {

        return "usercenter/fundRecord/recharge";
    }

    /**
     * 提现.
     * @return
     */
    @RequestMapping(value = "/withdraw.html")
    public String withdraw() {

        return "usercenter/fundRecord/withdraw";
    }

}
