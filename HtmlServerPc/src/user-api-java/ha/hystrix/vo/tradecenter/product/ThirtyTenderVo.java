package com.xxd.ha.hystrix.vo.tradecenter.product;

import com.xxd.ha.hystrix.vo.tradecenter.StatusVo;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class ThirtyTenderVo implements Serializable {

    private static final long serialVersionUID = 1990961040951538062L;

    private String name = "";

    private String id = "";

    private float floatingRate;

    private String limitPurchaseCount = "";

    private String plannedAnnualRate = "";

    private String leastPeriod = "";

    private String leastPeriodUnit = "";

    private String leastTenderAmountLabel = "";

    private String mostTenderAmountLabel = "";

    private String accumulatedInvestors = "";

    private String floatingRateFormat = "";

    private String remark = "";

    private StatusVo status = new StatusVo();
}
