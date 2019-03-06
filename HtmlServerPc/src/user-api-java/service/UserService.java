package com.xxd.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.xxd.common.exception.ServiceException;
import com.xxd.common.exception.TokenException;
import com.xxd.common.extension.spring.SpringApplicationUtil;
import com.xxd.common.util.HttpHelper;
import com.xxd.constant.Constant;
import com.xxd.constant.RedisKeysConstant;
import com.xxd.ha.hystrix.command.investment.InvestStatusCommand;
import com.xxd.ha.hystrix.command.usercenter.IsLoginedCommand;
import com.xxd.ha.hystrix.command.usercenter.LoginCommand;
import com.xxd.ha.hystrix.command.usercenter.UserInfoByTokenCommand;
import com.xxd.model.Appro;
import com.xxd.model.Employee;
import com.xxd.model.User;
import com.xxd.util.Configuration;
import com.xxd.util.RedisUtil;
import com.xxd.util.TokenUtil;
import com.xxd.webservice.CXF_Factory;
import com.xxd.webservice.facade.*;
import com.xxd.webservice.impl.common.DataResponse;
import com.xxdai.constant.AppConsts;
import com.xxdai.core.util.http.WSResponse;
import com.xxdai.core.util.json.JsonUtil;
import com.xxdai.core.util.lang.StringUtil;
import com.xxdai.encrypt.EscapeCode;
import com.xxdai.ws.util.WSModelResponse;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class UserService {
    private static final Log log = LogFactory.getLog(UserService.class);
    protected UserCXFService userCXFService = (UserCXFService) CXF_Factory.getFactory(UserCXFService.class, Configuration.getInstance().getValue("webService_url") + "/userWebService").create();
    protected AccountTradeCXFService accountTradeCXFService = (AccountTradeCXFService) CXF_Factory.getFactory(AccountTradeCXFService.class, Configuration.getInstance().getValue("trade_url") + "/accountTradeWebService").create();
    protected ApproCXFService approCXFService = (ApproCXFService) CXF_Factory.getFactory(ApproCXFService.class, Configuration.getInstance().getValue("webService_url") + "/approWebService").create();
    protected ApproQueryCXFService approQueryService = (ApproQueryCXFService) CXF_Factory.getFactory(ApproQueryCXFService.class, Configuration.getInstance().getValue("webService_url") + "/approQueryWebService").create();
    protected PartnerPromotionCXFService partnerPromotionCXFService = (PartnerPromotionCXFService) CXF_Factory.getFactory(PartnerPromotionCXFService.class, Configuration.getInstance().getValue("webService_url") + "/partnerPromotionWebService").create();
    protected PopularizeCFXService popularizeCFXService = (PopularizeCFXService) CXF_Factory.getFactory(PopularizeCFXService.class, Configuration.getInstance().getValue("webService_url") + "/popularizeCFXService").create();
    protected RedisMsgCXFService redisMsgCXFService = (RedisMsgCXFService) CXF_Factory.getFactory(RedisMsgCXFService.class, Configuration.getInstance().getValue("webService_url") + "/redisMsgWebService").create();
    protected BorrowQueryCXFService borrowQueryService = (BorrowQueryCXFService) CXF_Factory.getFactory(BorrowQueryCXFService.class, Configuration.getInstance().getValue("webService_url") + "/borrowQueryWebService").create();

    /**
     * 创建formToken并存储在redis里.
     *
     * @param request
     * @return
     */
    public String createFormToken(HttpServletRequest request) {
        String formToken = TokenUtil.createToken(HttpHelper.getUserAgent(request));
        RedisUtil redisUtil = (RedisUtil) SpringApplicationUtil.getBean("redisUtil");
        redisUtil.setRedis(formToken, new JSONObject());
        return formToken;
    }

    /**
     * 判断用户登陆状态.
     *
     * @param token
     * @return
     */
    public boolean isLogin(String token, String ua) {
        if (StringUtils.isBlank(token))
            return false;
        return new IsLoginedCommand(token, ua).execute();
    }


    public JSONObject getUserInfo(String token, String ua) {
        if (StringUtils.isBlank(token)) {
            return new JSONObject();
        }
        return new UserInfoByTokenCommand(token, ua).execute().getJSONObject("userInfo").getJSONObject("data");
    }

    /**
     * V3注册
     *
     * @param param
     * @return
     * @throws
     */
    public JSONObject regV3Handler(JSONObject param) {
        log.info(String.format("regV3 param = %s", param));
        JSONObject result = new JSONObject();
        try {
            //注册
            JSONObject regResult = registV3(param);
            result.put("regResultCode", regResult.getString("regResultCode"));
            result.put("regDesc", regResult.getString("regDesc"));

            if (regResult.get("user") != null) {
                User user = (User) regResult.get("user");
                result.put("user", user);
                param.put("user", user);
            }


            //手机认证
            JSONObject mobileResult = mobileAppro(param);
            int mobileResultCode = 1;
            if (mobileResult != null) {
                mobileResultCode = mobileResult.getIntValue("mobileResultCode");
                result.put("mobileResultCode", mobileResultCode);
                result.put("mobileDesc", mobileResult.getString("mobileDesc"));
            }

            //新新推广
            JSONObject popularizeResult = popularize(param, mobileResultCode == 0 ? true : false);
            if (popularizeResult != null) {
                result.put("popularizeResultCode", popularizeResult.getString("popularizeResultCode"));
                result.put("popularizeDesc", popularizeResult.getString("popularizeDesc"));
            }

            //处理商户用户信息
            JSONObject partnerResult = partnerHandler(param);
            if (partnerResult != null) {
                result.put("partnerResultCode", partnerResult.getString("partnerResultCode"));
                result.put("partnerDesc", partnerResult.getString("partnerDesc"));
            }

            //实名认证
            JSONObject realNameResult = realName(param);
            if (realNameResult != null) {
                result.put("realNameResultCode", realNameResult.getString("realNameResultCode"));
                result.put("realNameDesc", realNameResult.getString("realNameDesc"));
            }

            //vip认证
            JSONObject vipResult = vipAppro(param);
            if (vipResult != null) {
                result.put("vipResultCode", vipResult.getString("vipResultCode"));
                result.put("vipDesc", vipResult.getString("vipDesc"));
            }
        } catch (ServiceException se) {
            result.put("resultCode", se.getCode());
            result.put("msg", se.getMessage());
        } catch (Exception e) {
            result.put("resultCode", 201);
            result.put("msg", "注册失败");
            log.error("regV3 fail.", e);
        }
        return result;
    }

    /**
     * 注册
     *
     * @param param
     * @throws ServiceException
     */
    public JSONObject registV3(JSONObject param) throws ServiceException {
        JSONObject result = new JSONObject();
        try {
            String userName = param.getString("userName");
            String phone = param.getString("phone");
            String ip = param.getString("ip");
            String password = param.getString("password");
            String referer = param.getString("siteFrom");
            String landingPage = param.getString("landingPage");
            String terminal = param.getString("terminal");
            String fundActivityCode = param.getString("fundActivityCode");
            //对手机号，密码，真实姓名，身份证号进行简单的校验
            if (StringUtils.isBlank(phone)) {
                throw new ServiceException("您还未输入手机号码", 101);
            }
            if (password == null || "".equals(password)) {
                throw new ServiceException("您还未输入密码", 102);
            }
            User user = new User();
            userName = userName != null && !"".equalsIgnoreCase(userName) ? userName : phone;
            user.setUserName(userName);
            user.setEmail(null);
            user.setStatus("1");
            user.setAddIp(ip);
            user.setPassword(EscapeCode.Encryption(password));
            user.setHeadImg(Configuration.getInstance().getValue("headimg"));

            // 用户来源
            String regsource = param.getString("regsource");
            regsource = regsource == null || "".equals(regsource) ? "7" : regsource;

            //注册时访问来源,与v6_front保持一致
            String defaultUrl = "http://www.xinxindai.com/m";
            if (StringUtils.isBlank(referer)) {
                referer = defaultUrl;
            }
            if (StringUtils.isBlank(landingPage)) {
                landingPage = defaultUrl;
            }
            referer += "|" + landingPage;
            referer = referer.length() > 2000 ? referer.substring(0, 1999) : referer;
            user.setRegsource(regsource);
            user.setReferer(referer);

            //职业状态
            String occupationState = param.getString("job");
            if (StringUtils.isNotBlank(occupationState) && occupationState.equalsIgnoreCase("student")) {
                occupationState = Constant.OCCUPATION_STATE_UNDERGRADUATE;
            }
            user.setOccupation(occupationState);

            JSONObject regJson = new JSONObject();
            regJson.put("user", user);
            regJson.put("ip", ip);
            regJson.put("terminalVer", terminal);

            //日日盈活动标识
            if (fundActivityCode != null && !"".equalsIgnoreCase(fundActivityCode)) {
                regJson.put("activityCode", fundActivityCode);
            }

            if(param.get("channel") != null) {
                regJson.put("channel",param.getString("channel"));
            }

            //===注册
            log.info("register request param : " + regJson.toJSONString());
            log.info(String.format("begin time = %s", System.currentTimeMillis()));
            String userStr = userCXFService.registV3(regJson.toJSONString());
            log.info(String.format("end time = %s", System.currentTimeMillis()));
            log.info("register response :" + userStr);
            DataResponse dataResponse = JsonUtil.jsonToBean(userStr, DataResponse.class);
            if (dataResponse.getResultCode() < 0) {
                throw new ServiceException(dataResponse.getDesc(), 103);
            }
            user = JsonUtil.jsonToBean(dataResponse.getData().toString(), User.class);
            result.put("user", user);

            //添加账户
            param.put("user", user);
            createAccount(param);
            result.put("regResultCode", Constant.BIZAPI_SUCCESS_CODE);
            result.put("regDesc", "注册成功");
            log.info("registV3 resp = " + result.toJSONString());
        } catch (ServiceException se) {
            log.error(String.format("[%s]%s", se.getCode(), se.getMessage()));
            result.put("regResultCode", se.getCode());
            result.put("regDesc", se.getMessage());
            //throw se;
        } catch (Exception e) {
            log.error("registV3 error.", e);
            result.put("regResultCode", 104);
            result.put("regDesc", "注册失败");
        }
        return result;
    }

    /**
     * 添加账户
     *
     * @param param
     * @throws ServiceException
     */
    public void createAccount(JSONObject param) throws ServiceException {
        try {
            String ip = param.getString("ip");
            User user = (User) param.get("user");
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("userId", user.getUserId());
            jsonObject.put("ip", ip);
            log.info("register init user account request param = " + jsonObject.toJSONString());
            log.info(String.format("begin time = %s", System.currentTimeMillis()));
            String str = accountTradeCXFService.initialAccount(jsonObject.toJSONString());
            log.info(String.format("end time = %s", System.currentTimeMillis()));
            log.info("register init user account response = " + str);
            WSResponse wsResponse = JsonUtil.jsonToBean(str, WSResponse.class);

            if (wsResponse.getResultCode() != 0) {
                log.error("添加账户失败：" + wsResponse.getDesc());
                throw new ServiceException("初始化账户失败", 150);
            } else {
                log.info("添加账户成功：" + user.getUserName());
            }
        } catch (Exception e) {
            log.error("添加账户失败：" + e.getMessage(), e);
            throw new ServiceException("初始化账户异常", 151);
        }
    }

    /**
     * 实名认证
     *
     * @param param
     * @throws ServiceException
     */
    public JSONObject realName(JSONObject param) {
        if (param.get("user") == null) {
            return null;
        }
        JSONObject result = new JSONObject();
        try {
            String realName = param.getString("realname");
            String idCardNo = param.getString("idCardNo");

            if (StringUtils.isBlank(realName)) {
                throw new ServiceException("您还未输入真实姓名", 103);
            }
            if (StringUtils.isBlank(idCardNo)) {
                throw new ServiceException("您还未输入真实身份证号", 104);
            }
            /**调用身份认证接口 start**/
            String picUp = param.getString("picUp");
            String picDown = param.getString("picDown");
            JSONArray jsonArray = new JSONArray();
            JSONObject idJson = new JSONObject();
            User user = (User) param.get("user");
            String ip = param.getString("ip");
            idJson.put("userId", user.getUserId());
            idJson.put("realname", realName);
            idJson.put("idCardNo", idCardNo);
            idJson.put("idCardType", 1);
            idJson.put("picUp", picUp);
            idJson.put("picDown", picDown);
            idJson.put("sendIp", ip);
            jsonArray.add(idJson);
            log.info("checkRealName req param = " + jsonArray.toJSONString());
            log.info(String.format("begin time = %s", System.currentTimeMillis()));
            String jsonstr = approCXFService.checkRealName(jsonArray.toString());
            log.info(String.format("end time = %s", System.currentTimeMillis()));
            log.info("checkRealName resp= " + jsonstr);
            /**调用身份认证接口 over**/
            /**接口返回值处理 start*/
            WSResponse wsr = JsonUtil.jsonToBean(jsonstr, WSResponse.class);
            int resultCode = wsr.getResultCode();
            String msg = "";
            //认证已通过
            if (resultCode == 1) {
                result.put("realNameResultCode", 0);
                result.put("realNameDesc", "实名认证通过");
            } else {
                result.put("realNameResultCode", resultCode);
            }

            switch (resultCode) {
                case -6:
                    msg = "用户不存在，请重新登录";
                    break;
                case -7:
                    msg = "您当前使用的IP地址不合法，请勿攻击";
                    break;
                case -19:
                    msg = "已经认证通过，无需再次提交";
                    break;
                case -20:
                    msg = "身份证号码填写有误，请重新填写";
                    break;
                case -21:
                    msg = "身份证号码填写有误，请重新填写";
                    break;
                case -22:
                    msg = "身份证号码填写有误，请重新填写";
                    break;
                case -23:
                    msg = "证件号码已存在，请重新填写或与客服联系";
                    break;
                case -99:
                    msg = "系统繁忙，请与客服联系";
                    break;
                case 0:
                    msg = "已提交认证信息,请等待审核";
                    break;
                case 2:
                    msg = "认证不通过：身份证号码与姓名不一致，请重新输入";
                    break;
                case 3:
                    msg = "您的身份证信息审核未通过，请重新提交资料认证";
                    break;
                default:
                    msg = "系统繁忙，请与客服联系";
                    break;
            }

            result.put("realNameDesc", msg);
        } catch (ServiceException se) {
            log.info(String.format("[%s]%s", se.getCode(), se.getMessage()));
            result.put("realNameResultCode", se.getCode());
            result.put("realNameDesc", se.getMessage());
        } catch (Exception e) {
            log.info("实名认证申请异常：" + e.getMessage(), e);
            result.put("realNameResultCode", 401);
            result.put("realNameDesc", "实名认证申请异常");
        }
        log.info("realName result:" + result.toJSONString());
        return result;
    }

    /**
     * vip认证
     *
     * @param param
     * @throws ServiceException
     */
    public JSONObject vipAppro(JSONObject param) {
        if (param.get("user") == null) {
            return null;
        }
        JSONObject result = new JSONObject();
        try {
            String vipCode = param.getString("vipCode");
            if (vipCode == null || "".equalsIgnoreCase(vipCode)) {
                log.info("vipCode is null");
                throw new ServiceException("VIP编码为空", 100);
            }

            User user = (User) param.get("user");
            String ip = param.getString("ip");

            String jsonstr = approQueryService.queryVipApproEmployeeNum(JsonUtil.beanToJson(vipCode));
            DataResponse personResponse = JsonUtil.jsonToBean(jsonstr, DataResponse.class);
            Employee employee = null;
            if (personResponse.getData() != null) {
                String dataStr = String.valueOf(personResponse.getData());
                employee = (Employee) JsonUtil.jsonToBean(dataStr, Employee.class);
            }

            if (null == employee) {
                throw new ServiceException("客服编号不存在", 404);
            }

            JSONArray vipJsonA = new JSONArray();
            JSONObject vipJsonB = new JSONObject();
            vipJsonB.put("userId", user.getUserId());
            vipJsonB.put("serviceNum", vipCode);
            vipJsonB.put("sendIp", ip);
            vipJsonA.add(vipJsonB);
            log.info("vip Apply req param=" + vipJsonA.toJSONString());
            log.info(String.format("begin time = %s", System.currentTimeMillis()));
            //String json = approCXFService.checkVip(vipJsonA.toString());
            String json = approCXFService.applyAndAuditVip(vipJsonA.toString());
            log.info(String.format("end time = %s", System.currentTimeMillis()));
            log.info("vip Apply resp = " + json);
            WSResponse wsResponse = JsonUtil.jsonToBean(json, WSResponse.class);
            if (wsResponse.getResultCode() == 1) {
                result.put("vipResultCode", 0);
                result.put("vipDesc", "VIP认证成功");
            } else {
                result.put("vipResultCode", wsResponse.getResultCode());
                result.put("vipDesc", wsResponse.getDesc());
            }
        } catch (ServiceException se) {
            log.error(String.format("[%s]%s", se.getCode(), se.getMessage()));
            result.put("vipResultCode", se.getCode());
            result.put("vipDesc", se.getMessage());
        } catch (Exception e) {
            log.error("vipApply,error = ", e);
            result.put("vipResultCode", 400);
            result.put("vipDesc", "VIP认证异常");
        }
        log.info("vipAppro result:" + result.toJSONString());
        return result;
    }

    /**
     * 处理商户用户信息
     *
     * @throws ServiceException
     */
    public JSONObject partnerHandler(JSONObject param) {
        if (param.get("com.xxd.user") == null) {
            return null;
        }
        JSONObject result = new JSONObject();
        try {
            String pCode = param.getString("pCode");
            String ip = param.getString("ip");
            if (!StringUtil.isNotBlank(pCode)) {
                log.info("pCode is null");
                throw new ServiceException("商户编码为空", 400);
            }
            JSONObject vipJsonB = new JSONObject();
            User user = (User) param.get("com.xxd.user");
            vipJsonB.put("userId", user.getUserId());
            vipJsonB.put("pCode", pCode);
            vipJsonB.put("ip", ip);
            log.info("add PartnerAndUserRelate req param=" + vipJsonB.toJSONString());
            log.info(String.format("begin time = %s", System.currentTimeMillis()));
            String json = partnerPromotionCXFService.addPartnerAndUserRelate(vipJsonB.toJSONString());
            log.info(String.format("end time = %s", System.currentTimeMillis()));
            log.info("add PartnerAndUserRelate resp = " + json);
            WSResponse wsResponse = JsonUtil.jsonToBean(json, WSResponse.class);
            result.put("partnerResultCode", wsResponse.getResultCode());
            result.put("partnerDesc", wsResponse.getDesc());
        } catch (ServiceException se) {
            log.error(String.format("[%s]%s", se.getCode(), se.getMessage()));
            result.put("partnerResultCode", se.getCode());
            result.put("partnerDesc", se.getMessage());
        } catch (Exception e) {
            log.error("addPartnerAndUserRelate,error = ", e);
            result.put("partnerResultCode", 401);
            result.put("partnerDesc", "绑定商户异常");
        }
        return result;
    }

    /**
     * 新新推广
     *
     * @param paramReg
     * @param isMobileAppro
     * @throws ServiceException
     */
    public JSONObject popularize(JSONObject paramReg, boolean isMobileAppro) {
        if (paramReg.get("user") == null) {
            return null;
        }
        JSONObject result = new JSONObject();
        try {
            String uuid = paramReg.getString("uuid");
            log.info("推广码：" + uuid);
            if (uuid == null || "".equalsIgnoreCase(uuid)) {
                throw new ServiceException("推广码为空", 300);
            }

            User user = (User) paramReg.get("user");
            String ip = paramReg.getString("ip");

            //推广注册，执行活动动作
            JSONObject param = new JSONObject();
            param.put("uuId", uuid);
            param.put("userId", user.getUserId());
            String actCode = paramReg.getString("actCode");
            actCode = actCode == null || "".equalsIgnoreCase(actCode) ? "consortium_extension" : actCode;
            param.put("activityCode", actCode);
            param.put("ip", ip);
            log.info("推广注册，请求参数：" + param.toJSONString());
            log.info(String.format("begin time = %s", System.currentTimeMillis()));
            String popularizeStr = popularizeCFXService.popularizeRegistration(param.toJSONString());
            log.info(String.format("end time = %s", System.currentTimeMillis()));
            log.info("推广注册，响应内容：" + popularizeStr);
            WSModelResponse resp = JsonUtil.jsonToBean(popularizeStr, WSModelResponse.class);
            if (resp.getResultCode() != AppConsts.WS_RETURN_SUCC) {
                log.info("推广注册失败，失败原因：" + resp.getDesc() + "，结果码：" + resp.getResultCode());
                throw new ServiceException("推广绑定失败", 301);
            }

            log.info("推广注册成功");
            result.put("popularizeResultCode", 0);
            result.put("popularizeDesc", "推广绑定成功");

            if (isMobileAppro) {
                Long redisMsgSeq = redisMsgCXFService.selectRedisMsgSeq();
                JSONObject redisJson = new JSONObject();
                redisJson.put("redisMsgId", redisMsgSeq);
                redisJson.put("triggerName", "个人信息认证");
                redisJson.put("userId", user.getUserId());
                log.info("ACTIVITY_REWARD redis json " + redisJson.toJSONString());
                redisMsgCXFService.saveAccountTradeMsg(redisMsgSeq,
                        RedisKeysConstant.ACTIVITY_REWARD_TOPIC,
                        redisJson.toJSONString());

                //发送通知
                redisMsgCXFService.sendMessage(RedisKeysConstant.ACTIVITY_REWARD_TOPIC, redisJson.toJSONString());
            }
        } catch (ServiceException se) {
            log.error(String.format("[%s]%s", se.getCode(), se.getMessage()));
            result.put("popularizeResultCode", se.getCode());
            result.put("popularizeDesc", se.getMessage());
        } catch (Exception e) {
            log.error("popularize Registration fail.", e);
            result.put("popularizeResultCode", 302);
            result.put("popularizeDesc", "推广绑定异常");
        }
        return result;
    }

    /**
     * 手机认证
     *
     * @param param
     * @return
     * @throws ServiceException
     */
    public JSONObject mobileAppro(JSONObject param) {
        if (param.get("user") == null) {
            return null;
        }
        JSONObject result = new JSONObject();
        try {
            String smsCode = param.getString("smsCode");
            String phone = param.getString("phone");
            String ip = param.getString("ip");
            User user = (User) param.get("user");
            JSONObject jsonObject1 = new JSONObject();
            jsonObject1.put("userId", user.getUserId());
            jsonObject1.put("mobile", phone);
            jsonObject1.put("randCode", smsCode);
            jsonObject1.put("clientIp", ip);
            log.info("register appro mobile request param = " + jsonObject1.toJSONString());
            log.info(String.format("begin time = %s", System.currentTimeMillis()));
            String resultStr4 = approCXFService.checkMobileCodeForApp(jsonObject1.toString());
            log.info(String.format("end time = %s", System.currentTimeMillis()));
            log.info("register appro mobile response = " + resultStr4);
            WSResponse resultRes4 = JsonUtil.jsonToBean(resultStr4, WSResponse.class);
            if (resultRes4.getResultCode() != 2) {
                log.error("user mobile appro fail：" + resultRes4.getDesc());
                result.put("mobileResultCode", 200);
                result.put("mobileDesc", "手机认证失败");
            } else {
                log.info("user mobile appro ok：" + phone);
                result.put("mobileResultCode", 0);
                result.put("mobileDesc", "手机认证通过");
            }
        } catch (Exception e) {
            log.error("user mobile appro fail：" + e.getMessage(), e);
            result.put("mobileResultCode", 201);
            result.put("mobileDesc", "手机认证异常");
        }
        log.info("mobileAppro result:" + result.toJSONString());
        return result;
    }

    /**
     * 用户信息认证
     *
     * @param userId
     * @return
     */
    public Map<String, String> getUserApproInfo(Long userId) {
        String mobileAppro = "0";
        String realnameAppro = "0";
        String vipAppro = "0";
        String emailAppro = "0";

        // 认证信息
        JSONObject obj = new JSONObject();
        obj.put("userId", userId);
        String str = borrowQueryService.queryAppro(obj.toString());
        DataResponse res = JsonUtil.jsonToBean(str, DataResponse.class);

        if (res.getData() != null) {
            String dataStr = String.valueOf(res.getData());
            Appro appro = JsonUtil.jsonToBean(dataStr, Appro.class);
            if (appro != null) {
                mobileAppro = appro.getMobile();
                realnameAppro = appro.getRealName();
                vipAppro = appro.getVip();
                emailAppro = appro.getEmail();
            }
        }

        Map<String, String> approMap = new HashMap<String, String>();
        approMap.put("mobileAppro", mobileAppro);
        approMap.put("realnameAppro", realnameAppro);
        approMap.put("vipAppro", vipAppro);
        approMap.put("emailAppro", emailAppro);

        return approMap;
    }

    public JSONObject getLoginUserInfo(String token, String ua) {
        JSONObject result = new JSONObject();
        try {
            // 未登录直接返回空
            if (StringUtils.isBlank(token)) {
                result.put("code", 100);
                result.put("info", "token为空");
                return result;
            }

            // 用户登录信息
            if (new IsLoginedCommand(token, ua).execute()) {
                JSONObject userData = this.getUserInfo(token, ua);
                JSONObject data = new JSONObject();
                data.put("name", userData.getString("nickname"));
                data.put("id", userData.getString("userid"));
                JSONObject status = new JSONObject();
                status.put("message", "已登录");
                status.put("code", 200);
                data.put("status", status);
                result.put("data", data);
                result.put("message", "操作成功");
                result.put("code", "200000");
            } else {
                result.put("code", 300);
                result.put("info", "查询不到");
            }
        } catch (Exception e) {
            log.error("getLoginUserInfo error", e);
            result.put("code", 400);
            result.put("info", "异常");
        } finally {
            return result;
        }
    }


    public boolean getInvestStatus(String token, String ua) {
        try {
            // 未登录直接返回空
            if (StringUtils.isBlank(token)) {
                return false;
            }
            return new InvestStatusCommand(token, ua).queue().get();
        } catch (Exception e) {
            return false;
        }
    }


    public JSONObject loginV7(String userName, String password, String userAgent) {
        JSONObject result = new JSONObject();
        try {
            if (userName == null || "".equalsIgnoreCase(userName)) {
                result.put("code", 500);
                result.put("message", "用户名不能为空");
                return result;
            }

            if (password == null || "".equalsIgnoreCase(password)) {
                result.put("code", 501);
                result.put("message", "密码不能为空");
                return result;
            }

            JSONObject loginVo = new LoginCommand(userName, password, userAgent).queue().get();


            if (loginVo != null) {
                result = loginVo;
            } else {
                result.put("code", 404);
                result.put("message", "登录失败");
            }

        } catch (Exception e) {
            log.error("userCenter user/login error ", e);
            result.put("code", 400);
            result.put("message", "登录异常");
        } finally {

            log.info("user/login " + result.toJSONString());
            return result;
        }
    }

    public JSONObject getAccountInfo(String token, String ua) {
        JSONObject result = new JSONObject();
        try {
            // 用户登录信息
            JSONObject userData = this.getUserInfo(token, ua);
            if (userData != null) {
                String userId = userData.getString("userid");

                JSONObject data = new JSONObject();
                data.put("name", userData.getString("nickname"));
                data.put("id", userId);
                JSONObject status = new JSONObject();
                status.put("message", "已登录");
                status.put("code", 200);
                data.put("status", status);
                result.put("data", data);
                result.put("message", "操作成功");
                result.put("code", "200000");

                JSONObject json = new JSONObject();
                json.put("userId", userId);
                String str = borrowQueryService.querySumAccountTotal(json.toJSONString());
                JSONObject jsonObject = JSON.parseObject(str);
                Object object = jsonObject.get("resultCode");
                if (object != null) {
                    String resultCode = object.toString();
                    if (StringUtils.equals("1", resultCode)) {
                        String usableAmount = jsonObject.getJSONObject("data").getString("usable");
                        result.put("usableAmount", usableAmount);
                    }
                }
            } else {
                result.put("code", 300);
                result.put("info", "查询不到");
            }
        } catch (Exception e) {
            result.put("code", 400);
            result.put("info", "异常");
        }
        return result;
    }
}

