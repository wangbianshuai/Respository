package com.xxd.web.controller.user;

import com.alibaba.fastjson.JSONObject;
import com.xxd.common.extension.spring.SpringApplicationUtil;
import com.xxd.common.util.CookieUtil;
import com.xxd.common.util.HttpHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.config.ApolloRemoteConfig;
import com.xxd.constant.Constant;
import com.xxd.web.controller.BaseController;
import com.xxd.ha.hystrix.command.biz.AdCommand;
import com.xxd.ha.hystrix.command.usercenter.LoginCommand;
import com.xxd.util.RedisUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 用户登陆控制层.
 */
@Controller
@RequestMapping("/i")
public class LoginController extends BaseController {

    /**
     * 登录页.
     */
    @RequestMapping(value = "/toLogin.html")
    public String toLogin(Model model) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.USERTOKEN);
        String agent = HttpHelper.getUserAgent(request);
        JsonUtil.copyValues(jsonObject, new AdCommand().execute());
        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("formtoken", userService.createFormToken(request));
        jsonObject.put("token", token);
        jsonObject.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        // 根据用户有么有实名认证跳转对应的页面
        return "user/login";
    }

    /**
     * 注册页.
     */
    @RequestMapping(value = "/toRegister.html")
    public String toRegister(Model model) {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.USERTOKEN);
        String agent = HttpHelper.getUserAgent(request);
        JsonUtil.copyValues(jsonObject, new AdCommand().execute());
        jsonObject.put("currentDate", System.currentTimeMillis());
        jsonObject.put("formtoken", userService.createFormToken(request));
        jsonObject.put("token", token);
        jsonObject.put("isLogin", userService.isLogin(token, HttpHelper.getUserAgent(request)));
        jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        model.addAttribute("globalData", jsonObject);
        model.addAttribute("global", ApolloRemoteConfig.getVersionProperties());
        // 根据用户有么有实名认证跳转对应的页面
        return "user/register";
    }

    @RequestMapping(value = "login.html", produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String login(
            @RequestParam(required = false, name = "username") String userName,
            @RequestParam(required = false, name = "password") String passWord,
            @RequestParam(required = false, name = "formtoken") String formToken,
            @RequestParam(required = false, name = "imgcode") String imgCode) {
        JSONObject result = new JSONObject();
        if (StringUtils.isBlank(userName) || StringUtils.isBlank(passWord)) {
            result.put("code", "-1");
            result.put("message", "账号密码不能为空");
            return result.toJSONString();
        }
        if (StringUtils.isBlank(imgCode)) {
            result.put("code", "-2");
            result.put("message", "图片验证码不能为空");
            return result.toJSONString();
        }
        if (formToken == null) {
            result.put("code", HttpStatus.SC_BAD_REQUEST);
            result.put("message", "非法请求");
            return result.toJSONString();
        }

        RedisUtil redisUtil = (RedisUtil) SpringApplicationUtil.getBean("redisUtil");
        JSONObject formObj = redisUtil.getRedisKey(formToken);
        String sessionImgCode = formObj.getString("imgCode");
        if (formObj == null || StringUtils.isBlank(sessionImgCode)) {
            result.put("code", "-2");
            result.put("message", "验证码失效，请刷新页面");
            return result.toJSONString();
        }
        if (!StringUtils.equalsIgnoreCase(imgCode, sessionImgCode)) {
            result.put("code", "-2");
            result.put("message", "您的验证码不正确");
            return result.toJSONString();
        }
        formObj.remove("imgCode");
        redisUtil.setRedis(formToken, formObj);

        new LoginCommand(userName, passWord, HttpHelper.getUserAgent(request)).execute();

        return result.toJSONString();
    }

    @RequestMapping(value = "isLogin.html", produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String isLogin() {
        try {
            String token = CookieUtil.getCookieValue(request, Constant.TOKEN);
            if (userService.isLogin(token, HttpHelper.getUserAgent(request))) {
                return "true";
            }
            return "false";
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "false";
    }

}