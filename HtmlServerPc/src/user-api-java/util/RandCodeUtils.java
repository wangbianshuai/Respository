/**
 * Copyright (c) 2017, www.xinxindai.com All Rights Reserved. 
 *
 */
package com.xxd.util;

import com.alibaba.fastjson.JSONObject;
import com.xxdai.randCode.RandCode;

/**
 * 描述
 *
 * @version $Id: RandCodeUtils.java 2017/3/28 14:44 $
 * @since jdk1.6
 */
public class RandCodeUtils {
    /**
   	 * 获取图片验证码
   	 * @return
   	 */
   	public static JSONObject getVerifyCode(){
   		RandCode code = RandCode.getVerifyCodeInstatnce();
   		String codeStr = code.getRandCode();
   		JSONObject obj = JSONObject.parseObject(codeStr);
   		return obj;
   	}

}
