package com.xxd.ha.hystrix.support;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.netflix.hystrix.HystrixCommand;
import com.netflix.hystrix.HystrixCommandProperties;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.ha.utils.HeaderHelper;


public abstract class AbstractHystrixCommand<T> extends HystrixCommand<T> {

    protected Headers headers = HeaderHelper.createDefaultHeaders();

    /**
     * cast null to empty.
     * @param message
     * @param apiName
     * @param clz
     * @return
     */
    protected JSONObject handleNullToEmpty(Message message, String apiName, Class clz) {
        JSONObject returnResult = new JSONObject();

        JSONObject obj = new JSONObject();
        obj.put("data", JSON.parseObject(
                JSON.toJSONString(JSONObject.toJavaObject((JSONObject) message.getData(), clz),
                        SerializerFeature.WriteMapNullValue, SerializerFeature.WriteNullStringAsEmpty)));
        obj.put("code", message.getCode());

        returnResult.put(apiName,obj);
        return returnResult;
    }

    /**
     * process.
     * @param apiEnum
     * @param headers
     * @param queryStrings
     * @param clz
     * @return
     */
    public JSONObject process(ApiEnum apiEnum, Headers headers, QueryStrings queryStrings, Class clz) {
        Message message = execute(apiEnum, headers, queryStrings);
        handlerMessage(message);
        return handleNullToEmpty(message, getCommandKey().name(), clz);
    }

    public JSONObject process(ApiEnum apiEnum, Headers headers, Class clz) {
        return process(apiEnum, headers, null, clz);
    }

    /**
     * By override this method, subclass can do some custom process with message.
     * @param message
     */
    protected void handlerMessage(Message message) {

    }

    /**
     * execute http request.
     * @param apiEnum
     * @param headers
     * @param queryStrings
     * @return
     */
    protected Message execute(ApiEnum apiEnum, Headers headers, QueryStrings queryStrings){
        Message message = null;
        if (headers == null && queryStrings == null) {
            message = HttpClientHelper.get(apiEnum);
        } else if (headers != null && queryStrings == null) {
            message = HttpClientHelper.get(apiEnum, headers);
        } else if (headers != null && queryStrings != null) {
            message = HttpClientHelper.get(apiEnum, headers, queryStrings);
        }
        return message;
    }

    protected Message execute(ApiEnum apiEnum, Headers headers){
        return execute(apiEnum, headers, null);
    }

    protected AbstractHystrixCommand(Setter setter) {
        super(setter.andCommandPropertiesDefaults(
                HystrixCommandProperties.Setter()
                        .withExecutionTimeoutInMilliseconds(3000)
                )
        );
    }
}
