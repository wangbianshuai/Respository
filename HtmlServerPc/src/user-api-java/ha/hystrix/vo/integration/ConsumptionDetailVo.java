package com.xxd.ha.hystrix.vo.integration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 消费贷详情.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsumptionDetailVo {

    private String contractModelURL;
    private IsSupportCreditAssignment isSupportCreditAssignment;
    private int leastPeriodValue;
    private double tenderAmountDown;
    private String plannedValueDate;
    private BigDecimal bidAmount = new BigDecimal(0);
    private double plannedAnnualRate;
    private int userid;
    private String expenseExplanation;
    private String productCategory;
    private BigDecimal leftTenderAmount = new BigDecimal(0);
    private RepaymentType repaymentType;
    private BigDecimal tenderAmountUp = new BigDecimal(0);
    private String bidInfo;
    private BigDecimal bonusValue = new BigDecimal(0);
    private LoanPurpose loanPurpose;
    private String bidCode;
    private String leastPeriodType;
    private BonusType bonusType;
    private String warrantyServiceEarmarkedURL;
    private String bidName;
    private String instalmentPlanName;
    private Status status;
    private int percent;
    private String riskGrade;
    private String endTime;

    /**
     * 用户评测次数
     */
    private String testCount;
    /**
     * 用户评测类型
     */
    private String typeName;
    /**
     * 评测限额
     */
    private String quota;
    /**
     * 用户剩余评测次数
     */
    private String count;
    /**
     * 重新评测时间
     */
    private String nextTestTime;
    /**
     * 平台可投额度
     */
    private String surplusAmount;
    /**
     * 平台在投总额
     */
    private String investmentAmount;

    @Data
    public static class IsSupportCreditAssignment {
        private String code;
        private String message;
    }

    @Data
    public static class RepaymentType {
        private String code;
        private String message;
    }

    @Data
    public static class LoanPurpose {
        private String code;
        private String message;
    }

    @Data
    public static class BonusType {
        private String code;
        private String message;
    }

    @Data
    public static class Status {
        private String code;
        private String message;
    }
}
