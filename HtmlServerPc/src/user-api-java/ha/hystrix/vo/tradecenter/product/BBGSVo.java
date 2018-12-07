package com.xxd.ha.hystrix.vo.tradecenter.product;

import com.xxd.ha.hystrix.vo.tradecenter.StatusVo;
import lombok.Data;

import java.io.Serializable;

@Data
public class BBGSVo implements Serializable {

    private static final long serialVersionUID = 228257862630310162L;

    private String id = "";

    private String name = "";

    private String plannedAnnualRateFrom = "";

    private String plannedAnnualRateTo = "";

    private String floatingRate = "";

    private String leastPeriod = "";

    private String leastTenderAmountLabel = "";

    private String mostTenderAmountLabel = "";

    private String accumulatedInvestors = "";

    private String remark = "";

    private StatusVo status = new StatusVo();

}
