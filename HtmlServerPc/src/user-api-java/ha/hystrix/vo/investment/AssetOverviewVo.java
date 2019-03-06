package com.xxd.ha.hystrix.vo.investment;

import lombok.Data;

/**
 * 个人资产总览.
 */
@Data
public class AssetOverviewVo {


    /**
     * accumulatedRechargeAmount : 100205
     * totalAssets : 100313.29
     * investmentAmount : 400
     * accumulatedIncome : 80.85
     * accumulatedWithdrawAmount : 0
     * dueInIncome : 17.44
     * availableBalance : 99845.85
     * frozenAmount : 50
     */

    private double accumulatedRechargeAmount;
    private double totalAssets;
    private double investmentAmount;
    private double accumulatedIncome;
    private double accumulatedWithdrawAmount;
    private double dueInIncome;
    private double availableBalance;
    private double frozenAmount;
}
