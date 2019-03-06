package com.xxd.web.controller.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.util.HttpHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.constant.Constant;
import com.xxd.enums.UserTypeEnum;
import com.xxd.ha.hystrix.command.investment.RiskExamResultCommand;
import com.xxd.ha.hystrix.command.usercenter.CityListCommand;
import com.xxd.ha.hystrix.command.usercenter.CompanyInfosCommand;
import com.xxd.ha.hystrix.command.usercenter.PersonalInfosCommand;
import com.xxd.ha.hystrix.command.usercenter.ProvinceListCommand;
import com.xxd.ha.hystrix.command.usercenter.account.AssetStatisticsCommand;
import com.xxd.ha.hystrix.command.usercenter.account.MembershipCommand;
import com.xxd.ha.hystrix.command.usercenter.account.UserDetailInfoCommand;
import com.xxd.ha.hystrix.vo.usercenter.UserDetailInfoVo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 用户中心控制器.
 */
@Controller
@RequestMapping("/usercenter")
public class UserCenterController extends AbstractIsInvestController {

    @RequestMapping(value = "/accountInfo.html")
    public String account(Model model, @CookieValue(value=Constant.TOKEN) String token, @RequestHeader("User-Agent") String ua) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        // 个人信息
        JsonUtil.copyValues(globalData, new UserDetailInfoCommand(token, ua).execute());
        JsonUtil.copyValues(globalData, new AssetStatisticsCommand(token, ua).execute());
        globalData.put("membership",new MembershipCommand(token, ua).execute());
        return "usercenter/account";
    }

    @RequestMapping(value = "/memberIntroduce.html")
    public String memberIntroduce(Model model, @CookieValue(value=Constant.TOKEN) String token, @RequestHeader("User-Agent") String ua) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        // 个人信息
        JsonUtil.copyValues(globalData, new UserDetailInfoCommand(token, ua).execute());
        return "usercenter/memberIntroduce";
    }

    /**
     * 充值.
     * @param model
     * @return
     */
    @RequestMapping(value = "/recharge.html")
    public String rechargeIdentity(Model model) {

        return "usercenter/fundRecord/recharge";
    }

    /**
     * 存管开户.
     * @return
     */
    @RequestMapping(value = "/openAccount.html")
    public String openAccount(Model model) {

        return "usercenter/fundRecord/openAccount";
    }

    @RequestMapping(value = "/withdraw.html")
    public String withdraw(Model model) {

        return "/usercenter/fundRecord/withdraw";
    }

    /**
     * 个人信息.
     * @param model
     * @return
     */
    @RequestMapping(value = "/personalInfo.html")
    public String personalInfo(Model model, @CookieValue(Constant.TOKEN) String token, @RequestHeader("User-Agent") String ua) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        // 个人信息
        JSONObject userInfoJson = new UserDetailInfoCommand(token, ua).execute();
        UserDetailInfoVo accountUserInfoVo = JsonUtil.toObject(userInfoJson.getJSONObject("userDetailInfo").getJSONObject("data"),
                UserDetailInfoVo.class);
        String userType = accountUserInfoVo.getUserDetailInfo().getUsertype();
        JsonUtil.copyValues(globalData, new ProvinceListCommand().execute());
        JsonUtil.copyValues(globalData, new CityListCommand(accountUserInfoVo.getBaseInfo().getProvince()).execute());
        JsonUtil.copyValues(globalData, userInfoJson);

        globalData.put("companyInfos", null);
        // 如果是个人查询固定资产、私营业主、财务状况、联系方式
        if (StringUtils.equals(userType, UserTypeEnum.INDIVIDUAL.getType())) {
            JsonUtil.copyValues(globalData, new PersonalInfosCommand(token, ua).execute());
        }
        // 查询企业信息
        else if (StringUtils.equals(userType, UserTypeEnum.ENTERPRISE.getType())) {
            JsonUtil.copyValues(globalData, new CompanyInfosCommand(token, ua).execute());
        }
        return "usercenter/personalData/personalInfo";
    }

    /**
     * 问卷调查.
     * @param model
     * @return
     */
    @RequestMapping(value = "/questionnaire.html")
    public String questionnaire(Model model) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        String token = globalData.get("token").toString();
        String ua = HttpHelper.getUserAgent(request);
        JsonUtil.copyValues(globalData, new RiskExamResultCommand(token, ua).execute());
        return "usercenter/personalData/questionnaire";
    }

    /**
     * 安全设置.
     * @param model
     * @return
     */
    @RequestMapping(value = "/securitySettings.html")
    public String securitySettings(Model model) {
        JSONObject globalData = (JSONObject) model.asMap().get("globalData");
        JSONObject userInfo = new JSONObject();
        userInfo.put("data", JsonUtil.toJSONObject(model.asMap().get("userInfo")));
        globalData.put("userInfo", userInfo);
        return "usercenter/personalData/securitySettings";
    }


    /**
     * 用户实名认证
     * @param model
     * @return
     */
    @RequestMapping(value = "/identity.html")
    public String identity(Model model) {

        return "usercenter/identity/identity";
    }

    /**
     * 用户开户成功
     * @param model
     * @return
     */
    @RequestMapping(value = "/success.html")
    public String identitySuccess(Model model) {

       return "usercenter/common/success";
    }

    /**
     * 用户开户失败
     * @param model
     * @return
     */
    @RequestMapping(value = "/error.html")
    public String identityFail(Model model) {

        return "usercenter/common/error";
    }

    @RequestMapping(value = "/openAccountSuccess.html")
    public String openaccountSuccess(Model model) {

        return "usercenter/common/openaccountSuccess";
    }


    @RequestMapping(value = "/openAccountError.html")
    public String openaccountError(Model model) {

        return "usercenter/common/openaccountError";
    }


    /**
     * 借款用户实名认证
     * @param model
     * @return
     */
    @RequestMapping(value = "/identityBorrow.html")
    public String identityBorrow(Model model) {

        return "usercenter/identity/borrow";
    }

}