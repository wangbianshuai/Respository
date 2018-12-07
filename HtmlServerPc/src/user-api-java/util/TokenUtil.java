/**
 * Copyright (c) 2014, www.xinxindai.com All Rights Reserved.
 */
package com.xxd.util;

import com.alibaba.fastjson.JSON;
import com.xxdai.core.util.cipher.CipherException;
import com.xxdai.core.util.cipher.CryptoUtil;
import com.xxdai.core.util.cipher.DigestUtil;
import com.xxdai.core.util.lang.StringUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

/**
 * ClassName: TokenUtil <br/>
 * Function: token工具类. <br/>
 * date: 2015年7月31日 上午11:40:49 <br/>
 *
 * @author zhaoxiaobo
 * @since JDK 1.6
 */
public class TokenUtil {

    private static final Log log = LogFactory.getLog(TokenUtil.class);


    public static String createToken(String userAgent) {
        long time = System.currentTimeMillis();
        log.info("createToken create time:" + time);
        //生成 token
        String jsonTokenWithoutUserAgent = JSON.toJSONString(time);
        log.info("jsonTokenWithoutUserAgent:" + jsonTokenWithoutUserAgent);
        String encryptedTxt = null;
        try {
            encryptedTxt = CryptoUtil.aesEncryptToHex(jsonTokenWithoutUserAgent, userAgent);
        } catch (CipherException e) {
            log.error("jsonTokenWithoutUserAgent:" + jsonTokenWithoutUserAgent + " userAgent:" + userAgent, e);
        } finally {
            return encryptedTxt;
        }
    }

    /**
     * generateToken:(设置令牌). <br/>
     *
     * @param request
     * @param tokenName 令牌名称
     * @return
     * @author zhaoxiaobo
     * @since JDK 1.6
     */
    public static String generateToken(HttpServletRequest request, String tokenName) {
        String token = null;
        Long time = new Date().getTime();
        try {
            token = DigestUtil.md5ToHex(
                    String.valueOf(tokenName + time + Math.random())
            );
            request.getSession().setAttribute(tokenName, token);
        } catch (Exception e) {
            log.error("令牌生成失败：" + tokenName + time + e);
        }
        return token;
    }

    /**
     * validToken:(判断当前token是否有效). <br/>
     *
     * @param request
     * @return
     * @author zhaoxiaobo
     * @since JDK 1.6
     */
    public static boolean validToken(HttpServletRequest request) {
        String requestToken = request.getParameter("token");
        String tokenName = request.getParameter("tokenName");
        String sessionToken = (String) request.getSession().getAttribute(tokenName);
        boolean result;
        if (StringUtil.isEmpty(sessionToken) || !requestToken.equals(sessionToken)) {
            result = false;
        } else {
            result = true;
        }
        log.info(String.format("requestToken=%s,reqeustTokenName=%s,sessionToken=%s,validToken=%s", requestToken, tokenName, sessionToken, result));
        return result;
    }

    /**
     * removeToken:(销毁令牌). <br/>
     *
     * @param request
     * @author zhaoxiaobo
     * @since JDK 1.6
     */
    public static void removeToken(HttpServletRequest request) {
        String tokenName = request.getParameter("tokenName");
        request.getSession().removeAttribute(tokenName);
    }

    /**
     * getTokenName:(获取格式化后的token名). <br/>
     *
     * @param prefix 前缀（行为）
     * @param id     （bw或tr）
     * @return
     * @author zhaoxiaobo
     * @since JDK 1.6
     */
    public static String getTokenName(String prefix, String id) {
        if (StringUtil.isNotBlank(id)) {
            return prefix + "_" + id + "_TOKEN";
        } else {
            return prefix + "_TOKEN";
        }
    }
}
