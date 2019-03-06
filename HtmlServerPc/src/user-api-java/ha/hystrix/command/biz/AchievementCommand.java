package com.xxd.ha.hystrix.command.biz;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.MultiLevelCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.bulletin.BulletinAchievementVo;

import java.math.BigDecimal;
import java.text.DecimalFormat;

/**
 * 成交金额
 */
public class AchievementCommand extends MultiLevelCacheHystrixCommand {

    public AchievementCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("biz"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_BULLETIN_ACHIEVEMENT.getName())));
    }

    @Override
    protected JSONObject run() {
        return run(ApiEnum.API_BULLETIN_ACHIEVEMENT, headers, BulletinAchievementVo.class);
    }


    @Override
    protected void handlerMessage(Message message) {
        JSONObject jsonObject = JsonUtil.toJSONObject(message.getData());
        JSONArray items = jsonObject.getJSONArray("items");
        for (int i = 0; i < items.size(); i++) {
            JSONObject itemsObject = items.getJSONObject(i);
            String code = itemsObject.getString("code");

            if ("TOTAL_REGISTER_USER".equals(code)) {
                jsonObject.put("totalRegister", getFormatRegister(itemsObject.getString("nvalue")));
            } else if ("VENTURE_BALANCE".equals(code)) {

                itemsObject.put("code", "SECURITY_TIME");
                itemsObject.put("name", "稳健运营时间");
                itemsObject.put("amount", jsonObject.getString("time"));
                itemsObject.put("unit", "");

                jsonObject.put("securityItem", itemsObject);

            } else if ("TOTAL_INCOME".equals(code)) {
                String nvalue = itemsObject.getString("nvalue");
                itemsObject.put("amount", getFormatValue(nvalue));
                String inforName = itemsObject.getString("inforName").replace("(元)", "");
                itemsObject.put("name", inforName);
                itemsObject.put("unit", "亿元");

                jsonObject.put("totalIncomeItem", itemsObject);
            } else if ("TOTAL_TRADE".equals(code)) {
                String nvalue = itemsObject.getString("nvalue");
                itemsObject.put("amount", getFormatValue(nvalue));
                String inforName = itemsObject.getString("inforName").replace("(元)", "");
                itemsObject.put("name", inforName);
                itemsObject.put("unit", "亿元");

                jsonObject.put("totalTradeItem", itemsObject);
            }
        }


    }

    private String getFormatRegister(String nvalue) {
        DecimalFormat df = new DecimalFormat("#,###");
        return df.format(Long.valueOf(nvalue));
    }


    private String getFormatValue(String nvalue) {
        BigDecimal value = new BigDecimal(Double.valueOf(nvalue) / 100000000);
        double doubleValue = value.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
        return String.valueOf(doubleValue);
    }

}
