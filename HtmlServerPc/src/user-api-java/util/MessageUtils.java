/**
 * Copyright (c) 2017, www.xinxindai.com All Rights Reserved. 
 *
 */
package com.xxd.util;

import com.alibaba.fastjson.JSONArray;
import org.apache.commons.lang3.ArrayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

/**
 * 描述
 *
 * @version $Id: MessageUtils.java 2017/3/28 14:49 $
 * @since jdk1.6
 */
public class MessageUtils {
	/**
	 * 日志记录器
	 */
	private static final Logger logger = LoggerFactory.getLogger(MessageUtils.class);

	//发送方式
	public static int SENDTYPE_SMS = 1;  	//短信
	public static int SENDTYPE_VOICE = 2;	//语音
	//验证码发送次数限制
    public static int SENDLIMIT_SMS_TIMES_1HOUR = 3;  		 //短信验证码1小时次数
    public static int SENDLIMIT_SMS_TIMES_24HOUR = 5; 		 //短信验证码24小时次数
    public static int SENDLIMIT_VOICE_TIMES_1HOUR = 1441;	 //语音验证码1小时次数(暂无限制)
    public static int SENDLIMIT_VOICE_TIMES_24HOUR = 30;      //语音验证码24小时次数

	/**********语音验证码功能业务编号***********/
	//债权转让
	public static String BUSICODE_TRADE_REQUEST = "TRADE_REQUEST";
	public static String BUSICODE_TRADE_REQUEST_VOICE = "TRADE_REQUEST_VOICE";
	//提现
	public static String BUSICODE_CASH_MONEY = "CASH_MONEY";
	public static String BUSICODE_CASH_MONEY_VOICE = "CASH_MONEY_VOICE";
	//修改支付密码
	public static String BUSICODE_CHANGE_PASSWORD = "CHANGE_PASSWORD";
	//修改绑定的手机号 - 旧手机认证
	public static String BUSICODE_OLD_MOBILE_RANDCODE = "OLD_MOBILE_RANDCODE";
	//手机认证
	public static String BUSICODE_MOBILE_APPRO = "MOBILE_APPRO";
	public static String BUSICODE_MOBILE_APPRO_VOICE= "MOBILE_APPRO_VOICE";
	//找回密码
	public static String BUSICODE_RETRIEVE_PASSWORD = "BUSICODE_RETRIEVE_PASSWORD";
	//注册
	public static String BUSICODE_REGISTER_VOICE = "BUSICODE_REGISTER_VOICE";
	//注册，2017新新中国行  全民户外运动嘉年华短信模板
	public static String BUSICODE_SMS_TEMPLATE_CARNIVAL = "BUSICODE_SMS_TEMPLATE_CARNIVAL";
	//注册，
	public static String BUSICODE_REGISTER_SMS = "BUSICODE_REGISTER_SMS";
	//注册，新业贷
	public static String AUTO_REG_PROMOTION_FROM_XYD = "AUTO_REG_PROMOTION_FROM_XYD";

	/**
	 * 校验手机验证码短信发送次数
	 *
	 * @param functionName
	 * @param request
	 */
	public static boolean checkSendSMSCount(String functionName,
			HttpServletRequest request, HttpServletResponse response) {
		boolean result = true;
		// 1小时内最大发送次数
		int MAX_COUNT_1H = 3;
		// 24小时内最大发送次数
		int MAX_COUNT_24H = 10;

		JSONArray jsonArray = null;
		for (Cookie cookie : request.getCookies()) {
			if (cookie.getName().equals(functionName)) {
				jsonArray = JSONArray.parseArray(cookie.getValue());
                break;
			}
		}
		Long curTime = System.currentTimeMillis();
		if (jsonArray == null) {
			jsonArray = new JSONArray();
		} else {
			int count_1h = 0;
			int count_24h = 0;
			for (int i = 0; i < jsonArray.size(); i++) {
				Long d = jsonArray.getLong(i);
				if (curTime - d < 60 * 60 * 1000) {
					count_1h++;
					count_24h++;
				} else if (curTime - d < 24 * 60 * 60 * 1000) {
					count_24h++;
				}
				if (count_1h >= MAX_COUNT_1H) {
					return false;
				}
				if (count_24h >= MAX_COUNT_24H) {
					return false;
				}
			}
		}

		jsonArray.add(curTime);
		Cookie cookie = new Cookie(functionName, jsonArray.toJSONString()); // 新建Cookie，保存本功能短信发送时间
		cookie.setMaxAge(24 * 60 * 60); // 浏览器cookie失效时间24h
		response.addCookie(cookie);
		return result;
	}

	/**
	 * 校验手机验证码发送次数
	 *
	 * @param functionName
	 * @param request
	 */
	public static int checkVerifyCodeTimeLimit(String functionName,int sendType,
			HttpServletRequest request, HttpServletResponse response) {
		int result = 0; //0:正常发送，1：超过1小时内发送次数限制，2：超过24小时内发送限制
		// 1小时内最大发送次数
		int MAX_COUNT_1H = 0;
		// 24小时内最大发送次数
		int MAX_COUNT_24H = 0;

		if (SENDTYPE_SMS == sendType) {
			MAX_COUNT_1H = SENDLIMIT_SMS_TIMES_1HOUR;
			MAX_COUNT_24H = SENDLIMIT_SMS_TIMES_24HOUR;
		}else{
			MAX_COUNT_1H = SENDLIMIT_VOICE_TIMES_1HOUR;
			MAX_COUNT_24H = SENDLIMIT_VOICE_TIMES_24HOUR;
		}

		JSONArray jsonArray = null;
        if (ArrayUtils.isNotEmpty(request.getCookies())) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals(functionName)) {
                    jsonArray = JSONArray.parseArray(cookie.getValue());
                    break;
                }
            }
        }
		Long curTime = System.currentTimeMillis();
		if (jsonArray == null) {
			jsonArray = new JSONArray();
		} else {
			int count_1h = 0;
			int count_24h = 0;
			for (int i = 0; i < jsonArray.size(); i++) {
				Long d = jsonArray.getLong(i);
				if (curTime - d < 60 * 60 * 1000) {
					count_1h++;
					count_24h++;
				} else if (curTime - d < 24 * 60 * 60 * 1000) {
					count_24h++;
				}
				if (count_1h >= MAX_COUNT_1H) {
					return 1;
				}
				if (count_24h >= MAX_COUNT_24H) {
					return 2;
				}
			}
		}

		jsonArray.add(curTime);
		Cookie cookie = new Cookie(functionName, jsonArray.toJSONString()); // 新建Cookie，保存本功能短信发送时间
		cookie.setMaxAge(24 * 60 * 60); // 浏览器cookie失效时间24h
		response.addCookie(cookie);
		return result;
	}
}
