package com.xxd.ha.hystrix.vo.usercenter;

import lombok.Data;

@Data
public class CompanyAccountDetailInfoVo {
    // 账户余额
    private double accountBalance;
    // 待还总额
    private double returnedAmount;
    // 累计借款
    private double accumulatedLoan;
}
