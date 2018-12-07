package com.xxd.web.controller.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.util.JsonUtil;
import com.xxd.config.ApolloRemoteConfig;
import com.xxd.constant.Constant;
import com.xxd.enums.UserTypeEnum;
import com.xxd.ha.hystrix.command.biz.LinkCommand;
import com.xxd.ha.hystrix.command.tradecenter.IsInvestProduct;
import com.xxd.ha.hystrix.command.usercenter.account.UserCompanyInfoCommand;
import com.xxd.ha.hystrix.vo.usercenter.AccountUserInfoVo;
import com.xxd.web.controller.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 * 查询用户是否投资过七天大胜、日日盈、步步高升
 * @author EvanChou
 * @date 2018-02-02 上午11:38
 */
public abstract class AbstractIsInvestController extends BaseController {


    @ModelAttribute
    public void injectAttributeIsInvest(Model model,
                                        @CookieValue(value = Constant.TOKEN, required = false) String token,
                                        @RequestHeader("User-Agent") String ua) {
        JSONObject jsonObject = new JSONObject();
        JsonUtil.copyValues(jsonObject, new LinkCommand().execute());
        jsonObject.put("token", token);
        boolean isLogin = userService.isLogin(token, ua);
        jsonObject.put("isLogin", isLogin);
        if(isLogin) {
            AccountUserInfoVo userInfo = JsonUtil.toObject(userService.getUserInfo(token, ua), AccountUserInfoVo.class);
            assert userInfo != null;
            model.addAttribute("userInfo", userInfo);
            jsonObject.put("nickName", userInfo.getNickname());
            if(!StringUtils.equals(userInfo.getUsertype(), UserTypeEnum.NEW_ENTERPRISE.getType())){
                model.addAttribute("isInvestBBGS", new IsInvestProduct(token, ua, IsInvestProduct.ProductCode.BBGS).execute());
                model.addAttribute("isInvestQTDS", new IsInvestProduct(token, ua, IsInvestProduct.ProductCode.QTDS).execute());
                model.addAttribute("isInvestRRY", new IsInvestProduct(token, ua, IsInvestProduct.ProductCode.RRY).execute());
                model.addAttribute("isInvestXSB", new IsInvestProduct(token, ua, IsInvestProduct.ProductCode.XSB).execute());
            } else {
                jsonObject.put("nickName", new UserCompanyInfoCommand(token, ua).execute().getCompanyname());
            }
        }
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
    }
}
