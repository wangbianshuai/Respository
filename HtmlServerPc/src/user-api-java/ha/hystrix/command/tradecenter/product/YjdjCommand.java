package com.xxd.ha.hystrix.command.tradecenter.product;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.util.TypeUtils;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.ha.hystrix.support.FallbackWithCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.tradecenter.product.YJDJVo;
import org.joda.time.DateTime;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 月进斗金
 */
public class YjdjCommand extends FallbackWithCacheHystrixCommand {

    public YjdjCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_BRIEF_YJDJ.getName())));
    }

    @Override
    protected JSONObject run()  {
        return run(ApiEnum.API_TRADECENTER_BRIEF_YJDJ, headers, null, YJDJVo.class);
    }

    @Override
    protected void handlerMessage(Message message) {
        JSONObject data = (JSONObject) message.getData();
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        if (data.getLong("activitedStartDate") == 0) {
            data.put("activitedStartDateFormat", "");
            data.put("plannedAmount", 1);	// 计划金额
            data.put("plannedAnnualRate", 0);
            data.put("floatingRate", 0);
            data.put("leftAmount", 1);
        } else {
            data.put("activitedStartDateFormat", sdf.format(new Date(data.getLong("activitedStartDate"))));
        }
        if (data.getLong("activitedEndDate") == 0) {
            data.put("activitedEndDateFormat", "");
        } else {
            data.put("activitedEndDateFormat", sdf.format(new Date(data.getLong("activitedEndDate"))));
        }

        // 月进斗金计算倒计时时间
        YJDJVo yjdjVo = TypeUtils.castToJavaBean(data, YJDJVo.class);
        if (yjdjVo.getActivitedEndDate() != 0 &&
                yjdjVo.getActivitedStartDate() != 0 &&
                !"SOLD_OUT".equals(yjdjVo.getStatus().getCode())) {
            DateTime now = DateTime.now();
            if (now.isAfter(yjdjVo.getActivitedStartDate()) &&
                    now.isBefore(yjdjVo.getActivitedEndDate())) {
                long lefTime = yjdjVo.getActivitedEndDate() - now.getMillis();
                data.put("lefTime", lefTime);
            }
            else {
                data.put("lefTime", 0);
            }
        }
        else {
            data.put("lefTime", 0);
        }
    }
}
