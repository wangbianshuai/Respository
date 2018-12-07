package com.xxd.ha.hystrix.vo.tradecenter.product;

import com.xxd.ha.hystrix.vo.tradecenter.StatusVo;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 月进斗金模型
 */
@Data
public class YJDJVo implements Serializable {

    private static final long serialVersionUID = -1353657488714629571L;

    private String name = "";

    private String id = "";

    private BigDecimal plannedAmount;

    private BigDecimal plannedAnnualRate;

    private String leastPeriod = "";

    private String leastPeriodUnit = "";

    private String leastTenderAmountLabel = "";

    private String mostTenderAmountLabel = "";

    private long activitedStartDate;

    private String activitedStartDateFormat;

    private long activitedEndDate;

    private String activitedEndDateFormat;

    private long lefTime;

    private String floatingRate = "";

    private String periodName = "";

    private BigDecimal leftAmount;

    private String remark = "";

    private StatusVo status = new StatusVo();

}
