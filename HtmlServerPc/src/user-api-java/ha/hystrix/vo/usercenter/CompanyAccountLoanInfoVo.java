package com.xxd.ha.hystrix.vo.usercenter;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @author liangyuchao
 */
@Data
public class CompanyAccountLoanInfoVo {

    // 年利率
    private String annualRate;

    // 借款金额
    private double loanAmount;

    // 借款标题
    private String loanTitle;

    // 借款类型
    private String loanType;

    // 下一还款日期
    private Timestamp repaymentTime;

    // 期限
    private String term;
}
