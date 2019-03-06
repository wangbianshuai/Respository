package com.xxd.ha.hystrix.vo.integration;

import com.google.common.collect.Lists;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 标的信息披露.
 *
 * @author EvanChou
 * @date 2018-01-30 上午10:39
 */
@Data
public class InfoDisclosuresVo {

    private double income;

    /**
     *  收入
     */
    private String incomeStr;

    /**
     * 负债
     */
    private String liabilityStr;

    private String complaintsAdmPenalties;

    private Date updateDate;

    private String repaymentAbilityChange;

    private String fundsUse;

    private String operatingFinancialStatus;

    private String workType;

    private String industry;

    private List<PbocInfoListBean> pbocInfoList = Lists.newArrayList();

    @Data
    public static class PbocInfoListBean {

        private int guaranteeNum;

        private int accountNum;

        private int overdueAccountNum;

        private int overdue90AccountNum;

        // 账户类型（1-信用卡/2-住房贷款/3-其它贷款）
        private String creditType;

        private int osAccountNum;
    }
}
