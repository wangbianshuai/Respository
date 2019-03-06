package com.xxd.ha.hystrix.command.usercenter;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.ha.hystrix.support.MultiLevelCacheHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.ProvinceListVo;

/**
 * 查询省份列表
 * @author EvanChou
 * @date 2018-01-26 上午11:13
 */
public class ProvinceListCommand extends MultiLevelCacheHystrixCommand {


    public ProvinceListCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_PROVINCELIST.getName())));
    }

    @Override
    protected JSONObject run() throws Exception {
        return run(ApiEnum.API_USERCENTER_PROVINCELIST, headers, ProvinceListVo.class);
    }
}
