package com.xxd.web.interceptors;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.util.CookieUtil;
import com.xxd.common.util.HttpHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.constant.Constant;
import com.xxd.enums.UserTypeEnum;
import com.xxd.ha.hystrix.command.usercenter.EnterpriseAuthProgressCommand;
import com.xxd.ha.hystrix.vo.usercenter.AccountUserInfoVo;
import com.xxd.ha.hystrix.vo.usercenter.EnterpriseProgressVo;
import com.xxd.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CompanyAuthInterceptor implements HandlerInterceptor {

    @Autowired
    UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object o) throws Exception {
        String token = CookieUtil.getCookieValue(req, Constant.TOKEN);
        String ua = HttpHelper.getUserAgent(req);
        // 验证用URI 需要更改链接时同步更改
        String accountUri = "/usercenter/company/account.html";
        String authUri = "/usercenter/company/authentication.html";
        String loginUri = "/usercenter/company/login.html";
        String registerUri = "/usercenter/company/register.html";
        String licenseUri = "/usercenter/company/license.html";

        // 是否是登录注册页面
        boolean isLoginPage = StringUtils.equals(req.getRequestURI(), loginUri) ||
                StringUtils.equals(req.getRequestURI(), registerUri);
        if (StringUtils.isEmpty(token) || !userService.isLogin(token, ua)) {
            if(isLoginPage) {
                // 通过注册页面
                return true;
            }
            // 未登录跳转登录
            res.sendRedirect(loginUri);
            return false;
        }
        JSONObject userInfoJson = userService.getUserInfo(token, ua);
        AccountUserInfoVo accountUserInfoVo = JsonUtil.toObject(userInfoJson, AccountUserInfoVo.class);
        if(accountUserInfoVo == null){
            // 有token 登录状态未查到userInfo
            // res.sendRedirect(loginUri);
            return false;
        }
        String userType = accountUserInfoVo.getUsertype();
        if (StringUtils.equals(UserTypeEnum.NEW_ENTERPRISE.getType(), userType)) {
            // 新企业用户
            EnterpriseProgressVo eap = new EnterpriseAuthProgressCommand(token, ua).execute();
            // 是否认证页
            boolean isAuthPage = StringUtils.equals(req.getRequestURI(), authUri);
            if(eap.getStatus() && isLoginPage) {
                // 认证完 在登录页 跳转主页
                res.sendRedirect(accountUri);
                return false;
            }
            if(!eap.getStatus() && !isAuthPage && !StringUtils.equals(req.getRequestURI(), licenseUri)) {
                // 未认证完且不在认证页 不在license页 跳转认证页
                res.sendRedirect(authUri);
                return false;
            }
            // 其他情况通过
            return true;
        }
        res.sendRedirect("/usercenter/accountInfo.html");
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
