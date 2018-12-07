package com.xxd.ha.hystrix.vo.tradecenter.product;

import lombok.Data;

import java.io.Serializable;

/**
 * 月月派
 */
@Data
public class YYPVo implements Serializable {

    private static final long serialVersionUID = 8641604920408163756L;

    private String name = "";

    private String plannedAnnualRateFrom = "";

    private String plannedAnnualRateTo = "";

    private String floatingRate = "";

    private String frozenPeriod = "";

    private String leastPeriod = "";

    private String leastTenderAmountLabel = "";

    private String mostTenderAmountLabel = "";

    private String accumulatedInvestors = "";

    private String remark = "";

}
