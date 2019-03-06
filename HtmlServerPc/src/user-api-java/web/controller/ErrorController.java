package com.xxd.web.controller;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.exception.TokenException;
import com.xxd.common.util.JsonUtil;
import com.xxd.config.ApolloRemoteConfig;
import com.xxd.constant.Constant;
import com.xxd.ha.hystrix.command.biz.LinkCommand;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;

@Controller
@ControllerAdvice
public class ErrorController extends BaseController {

    @RequestMapping(value = "error")
    public String handler500Error(Model model) {
        JSONObject result = new JSONObject();
        result.put("isLogin", false);
        JsonUtil.copyValues(result, new LinkCommand().execute());
        model.addAttribute("globalData", result);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        return "common/error";
    }

    @RequestMapping(value = "notFound")
    public String handler404Error(Model model) {
        JSONObject result = new JSONObject();
        result.put("isLogin", false);
        JsonUtil.copyValues(result, new LinkCommand().execute());
        model.addAttribute("globalData", result);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        return "common/404";
    }

    @ExceptionHandler(TokenException.class)
    public String toLogin() {
        Cookie cookie = new Cookie(Constant.TOKEN,null);
        String serverName = request.getServerName();
        if (serverName.endsWith("xinxindai.com")){
            cookie.setDomain("xinxindai.com");
        } else {
            cookie.setDomain("xxd.com");
        }
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        String uri = request.getRequestURI();
        if(uri.startsWith("/usercenter/company")) {
            return "redirect:/usercenter/company/login.html";
        }
        if(uri.startsWith("/usercenter")) {
            return "redirect:/user/ilogin.html";
        }
        return "redirect:/";
    }


}
