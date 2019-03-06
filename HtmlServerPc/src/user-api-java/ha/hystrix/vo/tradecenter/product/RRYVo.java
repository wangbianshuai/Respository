package com.xxd.ha.hystrix.vo.tradecenter.product;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class RRYVo implements Serializable {

    private static final long serialVersionUID = -6238496428062791662L;

    private String name = "";

    private BigDecimal plannedAnnualRate = new BigDecimal(0.0);

    private String leastTenderAmountLabel = "";

    private String mostTenderAmountLabel = "";

    private String leastPeriod = "";

    private String accumulatedInvestors = "";

    private String floatingRate = "";

    private String productCode = "";

    private String bonusEnabled = "";

    private String plannedAnnualRateFormat = "";


}
