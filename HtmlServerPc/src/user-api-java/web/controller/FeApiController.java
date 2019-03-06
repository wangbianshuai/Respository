package com.xxd.web.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.xxd.common.extension.spring.SpringApplicationUtil;
import com.xxd.common.util.CodecUtil;
import com.xxd.common.util.CookieUtil;
import com.xxd.common.util.HttpHelper;
import com.xxd.constant.Constant;
import com.xxd.model.User;
import com.xxd.service.FeApiService;
import com.xxd.util.*;
import com.xxd.webservice.CXF_Factory;
import com.xxd.webservice.facade.ApproCXFService;
import com.xxd.webservice.facade.UserCXFService;
import com.xxdai.external.sms.ws.SMSCXFService;
import com.xxdai.constant.AppConsts;
import com.xxdai.core.util.http.HttpUtil;
import com.xxdai.core.util.http.WSMapResponse;
import com.xxdai.core.util.http.WSResponse;
import com.xxdai.core.util.json.JsonUtil;
import io.swagger.annotations.ApiParam;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.OutputStream;


/**
 * 跨域解决nginx访问统一增加feapi前缀.
 */
@Controller
@RequestMapping("/feapi/")
public class FeApiController extends BaseController {

    private Logger logger = LoggerFactory.getLogger(FeApiController.class);

    private UserCXFService userCXFService = (UserCXFService) CXF_Factory.getFactory(UserCXFService.class, Configuration.getInstance().getValue("webService_url") + "/userWebService").create();

    private ApproCXFService approCXFService = (ApproCXFService) CXF_Factory.getFactory(ApproCXFService.class, Configuration.getInstance().getValue("webService_url") + "/approWebService").create();

    private SMSCXFService smsCXFService = (SMSCXFService)CXF_Factory.getFactory(SMSCXFService.class,Configuration.getInstance().getValue("webService_url")+"/smsWebService").create();
    @Autowired
    FeApiService feApiService;

    @RequestMapping(value = "userInfo.html", produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public JSONObject userInfo() {
        JSONObject jsonObject = new JSONObject();
        String token = CookieUtil.getCookieValue(request, Constant.TOKEN);
        if (userService.isLogin(token, HttpHelper.getUserAgent(request))) {
            jsonObject.put("status", true);
            jsonObject.put("nickName", userService.getUserInfo(token, HttpHelper.getUserAgent(request)).getString("nickname"));
        } else
            jsonObject.put("status", false);
        return jsonObject;
    }

    /**
     * 将作缓存的接口暴漏给前端,异步调用.
     *
     * @return
     */
    @RequestMapping(value = "combine/invoke.html", produces = "application/json; charset=utf-8")
    @ResponseBody
    public JSONObject combineInvoke() {
        return feApiService.getInvokeData();
    }

    @RequestMapping(value = "randCode/createVerifyCode", produces = {"application/json;charset=UTF-8"})
    public
    @ResponseBody
    String createVerifyCode(@RequestParam(value = "formtoken") String formtoken,
                            HttpServletResponse response) {
        JSONObject result = new JSONObject();
        OutputStream output = null;
        try {
            RedisUtil redisUtil = (RedisUtil) SpringApplicationUtil.getBean("redisUtil");
            JSONObject formObj = redisUtil.getRedisKey(formtoken);
            if (formObj == null) {
                result.put("code", 400);
                result.put("info", "表单token不存在");
                return result.toJSONString();
            }

            //设置页面不缓存
            response.setHeader("Pragma", "No-cache");
            response.setHeader("Cache-Control", "no-cache");
            response.setDateHeader("Expires", 0);

            JSONObject obj = RandCodeUtils.getVerifyCode();
            if (null != obj) {
                String randCode = obj.getString("randCode");
                formObj.put("imgCode", randCode);
                redisUtil.setRedis(formtoken, formObj);

                byte[] imageCode = obj.getBytes("imageCode");

                ByteArrayInputStream in = new ByteArrayInputStream(imageCode);
                BufferedImage image = ImageIO.read(in);
                output = response.getOutputStream();
                //输出图象到页面
                ImageIO.write(image, "JPEG", response.getOutputStream());
                output.flush();
            }
        } catch (Exception e) {
            logger.error("生成图片验证码失败", e);
        } finally {
            if(output != null) {
                try{
                    output.close();
                } catch (Exception e) {

                }
            }
            return "";
        }
    }

    @RequestMapping(value = "randCode/checkVerifyCode", produces = {"application/json;charset=UTF-8"})
    public
    @ResponseBody
    String checkVerifyCode() {
        JSONObject result = new JSONObject();
        try {
            Object imgCodeObj = request.getSession().getAttribute("imgCode");
            String imgCode = request.getParameter("imgCode");
            if (imgCodeObj != null && imgCode != null && imgCode.equalsIgnoreCase(String.valueOf(imgCodeObj))) {
                result.put("resultCode", 0);
            } else {
                result.put("resultCode", 1);
            }
        } catch (Exception e) {
            logger.error("验证图片验证码失败", e);
        } finally {
            return result.toJSONString();
        }
    }

    /**
     * 登录
     */
    @RequestMapping(value = "users/login", produces = {"application/json;charset=UTF-8"})
    public
    @ResponseBody
    String login(@RequestParam(required = false, value = "formtoken") String formtoken,
                 @RequestParam(required = false, value = "imgcode") String imgcode,
                 @RequestParam(required = false, value = "username") String username,
                 @RequestParam(required = false, value = "password") String password) {
        JSONObject result = new JSONObject();
        try {
            if (formtoken == null) {
                result.put("code", -110);
                result.put("info", "必须提供formtoken字段");
                return result.toJSONString();
            }
            RedisUtil redisUtil = (RedisUtil) SpringApplicationUtil.getBean("redisUtil");
            JSONObject formObj = redisUtil.getRedisKey(formtoken);
            if (formObj == null) {
                result.put("code", -111);
                result.put("info", "formtoken失效");
                return result.toJSONString();
            }

            //图片验证码
            if (imgcode == null || "".equals(imgcode)) {
                result.put("code", -100);
                result.put("info", "图片验证码为空");
                return result.toJSONString();
            }

            String sessionImgCode = formObj.getString("imgCode");
            if (sessionImgCode == null) {
                result.put("code", -101);
                result.put("info", "图片验证码失效，请重新刷新");
                return result.toJSONString();
            }

            if (!imgcode.equalsIgnoreCase(sessionImgCode)) {
                logger.info("checkSendSMSCount Not by");
                result.put("code", -40);
                result.put("info", "您的图片验证码不正确");
                return result.toJSONString();
            }
            formObj.remove("imgCode");
            redisUtil.setRedis(formtoken, formObj);


            JSONObject loginObj = userService.loginV7(username,password, HttpHelper.getUserAgent(request));


            if (loginObj.getInteger("code") != 0) {

                result.put("code", loginObj.getInteger("code"));
                result.put("info", loginObj.getString("message"));
                return result.toJSONString();
            }

            //生成 token 和 digest 并放入缓存

            String userToken = loginObj.getString("data");

            redisUtil.setCookieToken(request,response,userToken);

            JSONObject data = new JSONObject();
            JSONObject user = userService.getUserInfo(userToken, HttpHelper.getUserAgent(request));
            data.put("user", user);
            data.put("userToken", userToken);
            result.put("data", data);
            result.put("front_url", Configuration.getInstance().getValue("front_url"));
            result.put("code", Constant.BIZAPI_SUCCESS_CODE);
            result.put("info", "登录成功");
        } catch (Exception e) {
            logger.error("登录失败", e);
            result.put("code", 100);
            result.put("info", "登录失败，请重新尝试或者联系客服");
        } finally {
            return result.toJSONString();
        }
    }


    /**
     * 非登陆状态下发送语音验证码
     *
     * @return
     */
    @RequestMapping(value = "/sendVoiceSMSLogout", produces = {"application/json;charset=UTF-8"})
    private
    @ResponseBody
    String sendVoiceSMSLogout(@RequestParam(required = false, value = "formtoken") String formtoken,
                              @RequestParam(required = false, value = "mobileNo") String mobileNo,
                              @RequestParam(required = false, value = "busiCode") String busiCode,
                              @RequestParam(required = false, value = "imgcode") String imgcode
                              ) {
        logger.info(String.format("sendVoiceSMSLogout begin time %s", System.currentTimeMillis()));
        JSONObject resultJson = new JSONObject();

        if (formtoken == null) {
            resultJson.put("code", -110);
            resultJson.put("info", "必须提供formtoken字段");
            return resultJson.toJSONString();
        }
        RedisUtil redisUtil = (RedisUtil) SpringApplicationUtil.getBean("redisUtil");
        JSONObject formObj = redisUtil.getRedisKey(formtoken);
        if (formObj == null) {
            resultJson.put("code", -111);
            resultJson.put("info", "formtoken失效");
            return resultJson.toJSONString();
        }
        // 获取用户手机号

        if (StringUtils.isBlank(mobileNo)) {
            resultJson
                    .put("info",
                            "手机号为空，无法发送语音验证码！");
            resultJson.put("code", -1);
            return resultJson.toString();
        }

        //获取功能编号
        if ("BUSICODE_REGISTER_VOICE".equals(busiCode)) {
            switch (MessageUtils.checkVerifyCodeTimeLimit(busiCode + mobileNo, MessageUtils.SENDTYPE_VOICE, request, response)) {
                case 0:
                    break;
                case 1:
                    resultJson.put("info", "一小时内最多可获取" + MessageUtils.SENDLIMIT_VOICE_TIMES_1HOUR + "次语音验证码！");
                    resultJson.put("code", -31);
                    return resultJson.toString();
                case 2:
                    resultJson.put("info", "一天内最多可获取" + MessageUtils.SENDLIMIT_VOICE_TIMES_24HOUR + "次语音验证码！");
                    resultJson.put("code", -31);
                    return resultJson.toString();
                default:
                    break;
            }
        } else {
            if (!MessageUtils.checkSendSMSCount(busiCode + "_VOICE" + mobileNo, request, response)) {
                resultJson.put("info", "您语音发送太频繁，请稍后重试！");
                resultJson.put("code", -3);
                return resultJson.toString();
            }
        }

        //图片验证码
        String sessionImgCodeObj = formObj.getString("imgCode");
        if (imgcode != null && !"".equals(imgcode) && sessionImgCodeObj != null) {
            String sessionImgCode = sessionImgCodeObj;
            if (!imgcode.equalsIgnoreCase(sessionImgCode)) {
                logger.info("checkSendSMSCount Not by");
                resultJson.put("code", -40);
                resultJson.put("info", "您的图片验证码不正确");
                return resultJson.toString();
            }
        }
        formObj.remove("imgcode");

        //生成验证码
        int randCode = (int) Math.round(Math.random() * 8999) + 1000;

        JSONObject obj = new JSONObject();
        String msg = "";
        int resultCode = 0;
        try {
            obj.put("verifyCode", randCode);
            obj.put("phone", mobileNo);
            obj.put("sendIp", HttpUtil.getRealIpAddr(request));
            obj.put("userId", 0);
            obj.put("busiCode", busiCode);
            String str = smsCXFService.sendVoiceSMS(obj.toJSONString());
            WSMapResponse ws = JsonUtil.jsonToBean(str, WSMapResponse.class);
            resultCode = ws.getResultCode();
            msg = ws.getDesc();
            if (ws.getResultCode() == AppConsts.WS_RETURN_SUCC) {
                request.getSession().setAttribute(busiCode + mobileNo, randCode);
                formObj.put("smsCode", randCode);
                formObj.put("phone", mobileNo);
                redisUtil.setRedis(formtoken, formObj);
                logger.info("语音验证码发送成功...");
                logger.info("语音验证码：" + randCode);
            } else {
                resultCode = -2;
                msg = ws.getDesc();
                logger.info("语音验证码发送失败：" + msg);
            }
        } catch (Exception e) {
            msg = "获取语音验证码失败，请刷新重试";
            resultCode = -3;
            logger.error("sendVoiceSMSLogout ERROR:" + e.getMessage(), e);
        }
        resultJson.put("info", msg);
        resultJson.put("code", resultCode);

        logger.info(String.format("sendVoiceSMSLogout end time %s", System.currentTimeMillis()));
        return resultJson.toString();
    }


    /**
     * 发送短信
     */
    @RequestMapping(value = "users/sendSMS", produces = {"application/json;charset=UTF-8"})
    public
    @ResponseBody
    String sendSMS(@RequestParam(required = false, value = "formtoken") String formtoken,
                   @RequestParam(required = false, value = "imgcode") String imgcode,
                   @RequestParam(required = false, value = "mobile") String mobile) {
        logger.info(String.format("sendSMS begin time = %s,phone=%s", System.currentTimeMillis(), mobile));
        JSONObject resultJson = new JSONObject();

        try {
            if (formtoken == null) {
                resultJson.put("code", -110);
                resultJson.put("info", "必须提供formtoken字段");
                return resultJson.toJSONString();
            }
            RedisUtil redisUtil = (RedisUtil) SpringApplicationUtil.getBean("redisUtil");
            JSONObject formObj = redisUtil.getRedisKey(formtoken);
            if (formObj == null) {
                resultJson.put("code", -111);
                resultJson.put("info", "formtoken失效");
                return resultJson.toJSONString();
            }

            if(imgcode == null || "".equals(imgcode)) {
                resultJson.put("code", -112);
                resultJson.put("info", "图片验证码不能为空");
                return resultJson.toJSONString();
            }

            //获取功能编号
            formObj.put("phone", mobile);

            switch (MessageUtils.checkVerifyCodeTimeLimit(MessageUtils.BUSICODE_REGISTER_SMS + mobile, MessageUtils.SENDTYPE_SMS, request, response)) {
                case 0:
                    break;
                case 1:
                    resultJson.put("info", "一小时内最多可获取" + MessageUtils.SENDLIMIT_SMS_TIMES_1HOUR + "次短信验证码！");
                    resultJson.put("code", -31);
                    return resultJson.toString();
                case 2:
                    resultJson.put("info", "一天内最多可获取" + MessageUtils.SENDLIMIT_SMS_TIMES_24HOUR + "次短信验证码！");
                    resultJson.put("code", -31);
                    return resultJson.toString();
                default:
                    break;
            }

            //图片验证码
            String sessionImgCodeObj = formObj.getString("imgCode");
            if (imgcode != null && !"".equals(imgcode) && sessionImgCodeObj != null) {
                String sessionImgCode = sessionImgCodeObj;
                if (!imgcode.equalsIgnoreCase(sessionImgCode)) {
                    logger.info("checkSendSMSCount Not by");
                    resultJson.put("code", -40);
                    resultJson.put("info", "您的图片验证码不正确");
                    return resultJson.toString();
                }
            }
            formObj.remove("imgcode");
            redisUtil.setRedis(formtoken, formObj);

            int randCode = (int) Math.round(Math.random() * 8999) + 1000;

            JSONArray jsonArray2 = new JSONArray();
            JSONObject jsonObject2 = new JSONObject();
            jsonObject2.put("mobile", mobile);
            jsonObject2.put("sendIp", HttpUtil.getRealIpAddr(request));
            jsonObject2.put("randCode", randCode);
            jsonArray2.add(jsonObject2);

            logger.info("send SMS request param ：" + jsonArray2.toJSONString());
            String resultString2 = approCXFService.sendSmsMsgFromReg(jsonArray2.toString());
            logger.info("send SMS response ：" + resultString2);
            WSResponse wsResponse2 = JsonUtil.jsonToBean(resultString2, WSResponse.class);

            String msg = wsResponse2.getDesc();
            int resultCode = wsResponse2.getResultCode();
            if (0 == resultCode) {
                resultJson.put("code", Constant.BIZAPI_SUCCESS_CODE);
                resultJson.put("info", "发送成功，请注意查收！");
                formObj.put("smsCode", randCode);
                redisUtil.setRedis(formtoken, formObj);
            } else if (-101 == resultCode) {
                resultJson.put("code", -30);
                resultJson.put("info", "您短信发送太频繁，如果无法收到短信请联系客服或使用语音验证码！");
            } else {
                resultJson.put("code", resultCode);
                resultJson.put("info", wsResponse2.getDesc());
            }
            logger.info(String.format("sendSMS end time = %s", System.currentTimeMillis()));
        } catch (Exception e) {
            logger.error("com.xxd.user sendSms error", e);
            resultJson.put("code", 400);
            resultJson.put("info", "异常");
        } finally {
            return resultJson.toString();
        }
    }

    /**
     * 验证手机号
     */
    @RequestMapping(value = "users/checkMobile", produces = {"application/json;charset=UTF-8"})
    public
    @ResponseBody
    String checkMobile(@RequestParam(required = true, value = "formtoken") String formtoken,
                       @RequestParam(required = true, value = "mobile") String mobile) {
        JSONObject resultJson = new JSONObject();
        logger.info(String.format("checkMobile begin time %s", System.currentTimeMillis()));
        try {
            if (formtoken == null) {
                resultJson.put("code", -110);
                resultJson.put("info", "必须提供formtoken字段");
                return resultJson.toJSONString();
            }
            RedisUtil redisUtil = (RedisUtil) SpringApplicationUtil.getBean("redisUtil");
            JSONObject formObj = redisUtil.getRedisKey(formtoken);
            if (formObj == null) {
                resultJson.put("code", -111);
                resultJson.put("info", "formtoken失效");
                return resultJson.toJSONString();
            }

            if (mobile != null && !"".equals(mobile)) {
                JSONArray jsonArray = new JSONArray();
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("mobile", mobile);
                jsonArray.add(jsonObject);
                logger.info("check mobile request param = " + jsonArray.toJSONString());
                String resultString = approCXFService.checkMobileIsExisting(jsonArray.toString());
                logger.info("check mobile response = " + resultString);
                WSResponse wsResponse = JsonUtil.jsonToBean(resultString, WSResponse.class);
                if (wsResponse.getResultCode() < 0) {
                    resultJson.put("code", 0);
                    resultJson.put("info", "手机号码已存在");
                } else {
                    resultJson.put("code", 1);
                    resultJson.put("info", "手机号码不存在");
                }
            }
        } catch (Exception e) {
            logger.error("验证手机号码失败", e);
            resultJson.put("code", 2);
            resultJson.put("info", "异常");
        } finally {
            logger.info(String.format("checkMobile end time %s", System.currentTimeMillis()));
            return resultJson.toJSONString();
        }
    }

    /**
     * 注册V3
     */
    @RequestMapping(value = "users/regV3", produces = {"application/json;charset=UTF-8"})
    public
    @ResponseBody
    String regV3(@RequestParam(required = false, value = "formtoken") String formtoken,
                 @RequestParam(required = false, value = "mobile") String mobile,
                 @RequestParam(required = false, value = "password") String password,
                 @RequestParam(required = false, value = "smscode") String smscode,
                 @RequestParam(required = false, value = "username") String username,
                 // @ApiParam(value = "新新推广码")
                 @RequestParam(required = false, value = "uuid") String uuid,
                 // @ApiParam(value = "活动码")
                 @RequestParam(required = false, value = "actcode") String actcode,
                 //  @ApiParam(value = "商户编码")
                 @RequestParam(required = false, value = "pcode") String pcode,
                 // @ApiParam(value = "身份证正面图片路径")
                 @RequestParam(required = false, value = "picup") String picup,
                 // @ApiParam(value = "身份证反面图片路径")
                 @RequestParam(required = false, value = "picdown") String picdown,
                 // @ApiParam(value = "真实姓名")
                 @RequestParam(required = false, value = "realname") String realname,
                 // @ApiParam(value = "身份证号码")
                 @RequestParam(required = false, value = "idcardno") String idcardno,
                 // @ApiParam(value = "VIP编号")
                 @RequestParam(required = false, value = "vipcode") String vipcode,
                 @RequestParam(required = false, value = "channel") String channel) {
        logger.info(String.format("reg begin time = %s", System.currentTimeMillis()));
        JSONObject resultJson = new JSONObject();
        resultJson.put("code", 1);
        resultJson.put("info", "注册失败，未知错误");
        try {
            if (formtoken == null) {
                resultJson.put("code", -110);
                resultJson.put("info", "必须提供formtoken字段");
                return resultJson.toJSONString();
            }
            RedisUtil redisUtil = (RedisUtil) SpringApplicationUtil.getBean("redisUtil");
            JSONObject formObj = redisUtil.getRedisKey(formtoken);
            if (formObj == null) {
                resultJson.put("code", -111);
                resultJson.put("info", "formtoken失效");
                return resultJson.toJSONString();
            }
            //手机号码
            JSONObject param = new JSONObject();
            param.put("phone", mobile);
            logger.info(String.format("regV3 phone %s", mobile));

            String tokenName = request.getParameter("tokenName");
            if (StringUtils.isNotBlank(tokenName)) {
                //判断当前token是否有效
                if (!TokenUtil.validToken(request)) {
                    JSONObject json = new JSONObject();
                    json.put("code", Constant.TOKEN_INVALID_ERROR);
                    json.put("info", "页面已过期，请重新尝试");
                    return json.toJSONString();
                }
                logger.info("reg token check passed...");
            }

            //短信验证码
            String smsCodeReq = formObj.getString("smsCode");
            if (smsCodeReq == null || smscode == null) {
                resultJson.put("code", 1024);
                resultJson.put("info", "获取不到您的注册验证码，请返回重新尝试");
                return resultJson.toJSONString();
            }
            String smsCodeStr = String.valueOf(smsCodeReq);
            if (!smscode.equalsIgnoreCase(smsCodeStr)) {
                resultJson.put("code", 1025);
                resultJson.put("info", "您的注册验证码错误，请返回重新尝试");
                return resultJson.toJSONString();
            }
            formObj.remove("smsCode");
            redisUtil.setRedis(formtoken, formObj);

            param.put("smsCode", smscode);

            //用户名
            param.put("userName", username);


            //用户操作IP
            String ip = HttpUtil.getRealIpAddr(request);
            param.put("ip", ip);

           /* String referer = (String) request.getSession().getAttribute("siteFrom");
            param.put("referer", referer);
            String landingPage = (String) request.getSession().getAttribute("landingPage");
            param.put("landingPage", landingPage); */

            //请求来源
            JSONObject terminalVer = new JSONObject();
            terminalVer.put("User-Agent", request.getHeader("User-Agent"));
            terminalVer.put("type", "WEB-APP");
            param.put("terminal", terminalVer.toJSONString());

            //新新推广码
            param.put("uuid", uuid);

            param.put("actCode", actcode);

            //商户用户注册，商户编码
            param.put("pCode", pcode);

            //实名认证，上传身份证正反面图片地址
            param.put("picUp", picup);
            param.put("picDown", picdown);

            //实名认证，真实姓名
            param.put("realname", realname);
            //实名认证，身份证号码
            param.put("idCardNo", idcardno);

            //VIP认证，员工编号
            param.put("vipCode", vipcode);

            //密码
            String passwordTemp = CodecUtil.md5Hex(CodecUtil.md5Hex(password));
            param.put("password", passwordTemp);

            //日日盈体验金标识
            String fundActivityCode = request.getParameter("fundActivityCode");
            param.put("fundActivityCode", fundActivityCode);

            param.put("channel",channel);

            //注册
            resultJson = userService.regV3Handler(param);
            logger.info(String.format("regV3Handler result %s ", resultJson));


            resultJson.put("front_url", Configuration.getInstance().getValue("front_url"));

            logger.info(String.format("reg end time = %s", System.currentTimeMillis()));

            String regResultCode = resultJson.getString("regResultCode");
            resultJson.put("code", regResultCode);
            resultJson.put("info", resultJson.getString("regDesc"));

            if (regResultCode != null && Constant.BIZAPI_SUCCESS_CODE.equalsIgnoreCase(regResultCode)) {
                request.getSession().removeAttribute("smsCode");

                User user = (User) resultJson.get("user");
                //生成 token 和 digest 并放入缓存

                JSONObject loginObj = userService.loginV7(user.getUserName(),password, com.xxd.common.util.HttpHelper.getUserAgent(request));
                if (loginObj.getInteger("code") != 0) {
                    resultJson.put("code", loginObj.getInteger("code"));
                    resultJson.put("info", loginObj.getString("message"));
                    return resultJson.toJSONString();
                }

                //生成 token 和 digest 并放入缓存

                String userToken = loginObj.getString("data");

                redisUtil.setCookieToken(request,response,userToken);


                JSONObject dataJson = new JSONObject();
                dataJson.put("user", user);
                dataJson.put("userToken", userToken);
                resultJson.put("data", dataJson);
            }

        } catch (Exception e) {
            logger.error("regV3 error", e);
            resultJson.put("code", 2);
            resultJson.put("info", "注册失败");
        } finally {
            // 销毁token
            TokenUtil.removeToken(request);
            logger.info("regV3 result:" + resultJson.toJSONString());
            return resultJson.toJSONString();
        }
    }

    @RequestMapping(value = "users/formToken", produces = {"application/json;charset=UTF-8"})
    public
    @ResponseBody
    String formToken(HttpServletRequest request) {
        JSONObject result = new JSONObject();
        result.put("token", userService.createFormToken(request));
        return result.toJSONString();
    }

    /**
     * 通过userToken查询当前登录信息
     * @param userToken
     * @param request
     * @return
     */
    @RequestMapping(value = "users/loginInfo", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public JSONObject loginInfo(@ApiParam(value = "userToken") @RequestParam(required = false, value = "userToken") String userToken, HttpServletRequest request) {
        return userService.getLoginUserInfo(userToken, HttpHelper.getUserAgent(request));
    }

    @RequestMapping(value = "users/accountInfo", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public JSONObject accountInfo(@RequestParam(required = false, value = "token") String userToken) {
        return userService.getAccountInfo(userToken, HttpHelper.getUserAgent(request));
    }


    @RequestMapping(value = "currentTime", produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public JSONObject getCurrentTime() {
        JSONObject message = new JSONObject();
        message.put("code", 200);
        message.put("message", "");
        JSONObject data = new JSONObject();
        data.put("currentTime", System.currentTimeMillis());
        message.put("data", data);
        return message;
    }
}