package com.xxd.ha.hystrix.command.usercenter;

import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.exception.ServiceException;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.enums.BizStatusEnum;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;

/**
 * 检查用户的唯一性
 */
public class CheckUniqueCommand extends AbstractHystrixCommand<Boolean> {

    private String userName;

    public CheckUniqueCommand(String userName) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_CHECKUNIQUE.getName())));
        this.userName = userName;
    }

    @Override
    protected Boolean run() throws Exception {
        QueryStrings queryStrings = QueryStrings.create()
                .addParameter("username", userName);
        Message message = HttpClientHelper.get(ApiEnum.API_USERCENTER_CHECKUNIQUE, headers, queryStrings);
        if (message == null)
            throw new ServiceException(BizStatusEnum.BIZ_ERROR.getStatus(), "检查失败");
        return message.getCode() == 1;
    }

    @Override
    protected Boolean getFallback() {
        return null;
    }
}
