package com.xxd.ha.hystrix.command.integration;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.enums.MessageStatus;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.integration.InfoDisclosuresVo;

/**
 * 标的信息披露.
 *
 * @author EvanChou
 * @date 2018-01-30 上午10:37
 */
public class BidInfoDisclosuresCommand extends AbstractHystrixCommand<JSONObject> {

    String bidCode;

    public BidInfoDisclosuresCommand(String bidCode) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("integration"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_INTEGRATION_PLATFORM_BID_INFO_DISCLOSURES.getName())));
        this.bidCode = bidCode;
    }

    @Override
    protected void handlerMessage(Message message) {
        JSONObject data = (JSONObject) message.getData();
        Object object = data.get("income");
        if (object == null) {
            data.put("incomeStr", "");
            data.put("liabilityStr", "无重大负债");
            return;
        }
        double income = data.getDouble("income");
        if (income <= 10000D) {
            data.put("incomeStr", "10000以下");
            data.put("liabilityStr", "8000以下");
        } else if (income <= 20000D) {
            data.put("incomeStr", "10001-20000");
            data.put("liabilityStr", "8001-16000");
        } else if (income <= 30000D) {
            data.put("incomeStr", "20001-30000");
            data.put("liabilityStr", "16001-25000");
        } else {
            data.put("incomeStr", "30000以上");
            data.put("liabilityStr", "25000以上");
        }
    }

    @Override
    protected JSONObject run() throws Exception {
        QueryStrings queryStrings = QueryStrings.create()
                .addPath("/" + bidCode + "/infoDisclosures");
        return process(ApiEnum.API_INTEGRATION_PLATFORM_BID_INFO_DISCLOSURES, headers, queryStrings, InfoDisclosuresVo.class);
    }

    @Override
    protected JSONObject getFallback() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("data", JSON.parseObject(
                JSON.toJSONString(new InfoDisclosuresVo(),
                        SerializerFeature.WriteMapNullValue, SerializerFeature.WriteNullStringAsEmpty)));
        jsonObject.put("code", MessageStatus.DATA_NOT_EXIST.getStatus());
        return JsonUtil.wrapperDataWithName(ApiEnum.API_INTEGRATION_PLATFORM_BID_INFO_DISCLOSURES.getName(), jsonObject);
    }
}