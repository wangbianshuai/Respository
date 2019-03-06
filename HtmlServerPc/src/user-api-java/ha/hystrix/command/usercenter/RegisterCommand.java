package com.xxd.ha.hystrix.command.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.dto.RequestDTO;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.enums.MessageStatus;
import com.xxd.common.exception.ServiceException;
import com.xxd.common.remoting.http.parameters.FormUrlEncoded;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.enums.BizStatusEnum;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;

/**
 * 用户注册
 */
public class RegisterCommand extends AbstractHystrixCommand<JSONObject> {

    private String userName;
    private String phone;
    private String password;
    private String smsCode;


    public RegisterCommand(String userName, String phone, String password, String smsCode) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_REGISTER.getName())));
        this.userName = userName;
        this.phone = phone;
        this.password = password;
        this.smsCode = smsCode;
    }

    @Override
    protected JSONObject run() throws Exception {
        FormUrlEncoded formUrlEncoded = FormUrlEncoded.create();
        RequestDTO requestDTO = RequestDTO.create();
        requestDTO.addParameter("userName", userName)
                .addParameter("phone", phone)
                .addParameter("password", password)
                .addParameter("code", smsCode);
        formUrlEncoded.setBody(requestDTO.transform2JsonString());
        Message registerMessage = HttpClientHelper.post(ApiEnum.API_USERCENTER_REGISTER, headers, formUrlEncoded);
        if (registerMessage == null || registerMessage.getCode() != MessageStatus.SUCCESS.getStatus()) {
            throw new ServiceException(BizStatusEnum.BIZ_ERROR.getStatus(), "注册失败");
        }
        return JsonUtil.toJSONObject(registerMessage.getData());
    }

    @Override
    protected JSONObject getFallback() {
        return null;
    }
}
