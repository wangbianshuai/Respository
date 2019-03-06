package com.xxd.web.controller.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.util.JsonUtil;
import com.xxd.constant.Constant;
import com.xxd.ha.hystrix.command.investment.AssetOverViewCommand;
import com.xxd.ha.hystrix.command.usercenter.account.CompanyAccountDetailInfoCommand;
import com.xxd.ha.hystrix.command.usercenter.account.CompanyAccountLoanInfoCommand;
import com.xxd.ha.hystrix.command.usercenter.account.UserDetailInfoCommand;
import com.xxd.ha.hystrix.vo.usercenter.AccountUserInfoVo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * 新企业页面，拦截器在CompanyInterceptor
 */
@Controller
@RequestMapping("/usercenter/company")
public class CompanyController extends AbstractIsInvestController {

    /**
     * 登录页
     * 需要更改路径请同步更改CompanyInterceptor
     * @return View
     */
    @GetMapping("/login.html")
    public String companyLogin(Model model) {
        String username =  request.getParameter("username");
        model.addAttribute("username", StringUtils.isEmpty(username)?"":username);
        return "usercenter/company/login";
    }

    /**
     * 注册页
     * 需要更改路径请同步更改CompanyInterceptor
     * @return View
     */
    @GetMapping("/register.html")
    public String companyRegister(Model model) {
        return "usercenter/company/register";
    }


    @GetMapping("/recharge.html")
    public String companyRecharge(Model model) {

        return "/usercenter/company/recharge";
    }

    /**
     * 企业账户主页
     * 请同步更改CompanyInterceptor
     * @return
     */
    @GetMapping("/account.html")
    public String companyAccount(Model model,
                                 @CookieValue(value = Constant.TOKEN) String token,
                                 @RequestHeader("User-Agent") String ua) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        int userid = ((AccountUserInfoVo)model.asMap().get("userInfo")).getUserid();
        model.addAttribute("companyDetailInfo", new CompanyAccountDetailInfoCommand(userid).execute());
        model.addAttribute("companyLoanInfoList", new CompanyAccountLoanInfoCommand(userid).execute());
        JsonUtil.copyValues(globalData, new UserDetailInfoCommand(token, ua).execute());
        return "usercenter/company/account";
    }

    @GetMapping("/account-info.html")
    public String companyAccountInfo() {
        return "usercenter/company/account-info";
    }

    /**
     * 企业认证页面
     * 请同步更改CompanyInterceptor
     * @return
     */
    @GetMapping("/authentication.html")
    public String companyAuthentication() {
        return "usercenter/company/authentication";
    }
    /**
     * 充值
     */
    @RequestMapping(value = "/recharge.html")
    public String rechargeIdentity() {
        return "/usercenter/company/recharge";
    }

    /**
     * 提现
     */
    @RequestMapping(value = "/withdraw.html")
    public String withdraw() {
        return "/usercenter/company/withdraw";
    }

    @RequestMapping(value = "/dealDetail.html")
    public String dealDetail(Model model,
                             @CookieValue(value = Constant.TOKEN) String token,
                             @RequestHeader("User-Agent") String ua) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        JsonUtil.copyValues(globalData, new AssetOverViewCommand(token, ua).execute());
        return "/usercenter/company/dealDetail";
    }

    /**
     * 银行卡设置
     * @return
     */
    @RequestMapping(value = "/bundled.html")
    public String bundled() {
        return "/usercenter/company/bundled";
    }

    @RequestMapping(value = "/license.html")
    public String license() {
        return "/usercenter/company/userLicense";
    }


    @RequestMapping(value = "/security-settings.html")
    public String securitySettings() {
        return "/usercenter/company/securitySettings";
    }


}
