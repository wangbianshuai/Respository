package com.xxd.ha.hystrix.command.tradecenter;

import com.netflix.hystrix.HystrixCommand;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.remoting.http.parameters.Headers;
import com.xxd.common.remoting.http.parameters.QueryStrings;
import com.xxd.common.remoting.http.sync.HttpClientHelper;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.utils.HeaderHelper;

/**
 * 是否投资过某个产品
 *
 * @author EvanChou
 * @date 2018-01-31 下午5:53
 */
public class IsInvestProduct extends HystrixCommand<Boolean> {

    String token;

    String ua;

    ProductCode productCode;

    public IsInvestProduct(String token, String ua, ProductCode productCode) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("tradeCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_INVEST_IS_INVEST_PRODUCT.getName())));
        this.token = token;
        this.ua = ua;
        this.productCode = productCode;
    }


    @Override
    protected Boolean run() throws Exception {
        Headers headers = HeaderHelper.createDefaultHeaders()
                .addHeader("token", token)
                .addHeader("User-Agent", ua);
        QueryStrings queryStrings = QueryStrings.create().addParameter("productCode", productCode.name());
        Message message = HttpClientHelper.get(ApiEnum.API_TRADECENTER_INVEST_IS_INVEST_PRODUCT, headers, queryStrings);
        return JsonUtil.toJSONObject(message.getData()).getBoolean("isInvestProduct");
    }

    @Override
    protected Boolean getFallback() {
        return Boolean.FALSE;
    }

    public enum ProductCode {

        BBGS,

        RRY,

        QTDS,

        XSB
    }
}
