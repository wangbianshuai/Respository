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

public class HomeAuthInterceptor implements HandlerInterceptor {

    @Autowired
    UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object o) throws Exception {
        String token = CookieUtil.getCookieValue(req, Constant.TOKEN);
        String ua = HttpHelper.getUserAgent(req);
        // 验证用URI 需要更改链接时同步更改
        String authUri = "/usercenter/company/authentication.html";
        String companyHomeUri = "/usercenter/company/account.html";
        if (token == null || StringUtils.isEmpty(token) || !userService.isLogin(token, ua)){
            return true;
        }

        JSONObject userInfoJson = userService.getUserInfo(token, ua);
        AccountUserInfoVo accountUserInfoVo = JsonUtil.toObject(userInfoJson, AccountUserInfoVo.class);
        if(accountUserInfoVo == null){
            // 有token 登录状态未查到userInfo
            // res.sendRedirect(loginUri);
            return true;
        }
        String userType = accountUserInfoVo.getUsertype();
        if (StringUtils.equals(UserTypeEnum.NEW_ENTERPRISE.getType(), userType)) {
            // 新企业用户
            EnterpriseProgressVo eap = new EnterpriseAuthProgressCommand(token, ua).execute();
            // 是否认证页
            if(eap.getStatus()){
                // 认证通过跳转企业用户主页
                res.sendRedirect(companyHomeUri);
                return false;
            }
            // 未认证完跳转认证页
            res.sendRedirect(authUri);
            return false;
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
