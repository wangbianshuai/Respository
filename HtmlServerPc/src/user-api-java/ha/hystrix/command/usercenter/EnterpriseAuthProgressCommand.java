package com.xxd.ha.hystrix.command.usercenter;

import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.EnterpriseProgressVo;

/**
 * @author liangyuchao
 */
public class EnterpriseAuthProgressCommand extends AbstractHystrixCommand<EnterpriseProgressVo> {

    private String token;
    private String ua;

    public EnterpriseAuthProgressCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_USERCENTER_ACCOUNT_ENTERPRISEOPENACNTPROGRESS.getName())));
        this.token = token;
        this.ua = ua;
    }

    @Override
    protected EnterpriseProgressVo run() throws Exception {
        headers.addHeader("token", token)
                .addHeader("User-Agent", ua);
        return JsonUtil.toJSONObject(HttpClientHelper.post(ApiEnum.API_USERCENTER_ACCOUNT_ENTERPRISEOPENACNTPROGRESS, headers).getData())
                .getObject("data", EnterpriseProgressVo.class);
    }

    @Override
    protected EnterpriseProgressVo getFallback() {
        return null;
    }
}
