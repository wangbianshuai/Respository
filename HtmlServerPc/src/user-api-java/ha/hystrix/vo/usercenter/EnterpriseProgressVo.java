package com.xxd.ha.hystrix.vo.usercenter;

import lombok.Data;

/**
 * @author liangyuchao
 */
@Data
public class EnterpriseProgressVo {

    // 1.实名认证

    private String companyRealNameApproStatus;

    // 实名认证失败次数
    private int companyRealNameApproFailedTimes;

    // 2.企业认证
    private String companyApproStatus;

    // 企业认证失败次数
    private int companyApproFailedTimes;

    // 3.银行卡认证
    private String companyBankApproStatus;

    // 银行卡认证失败次数
    private int companyBankApproFailedTimes;

    // 4.企业信息录入
    private int companyInfoEntryCompleted;

    // 5.存管开户
    private int companyUserOpenAccountCompletedStatus;

    public boolean getStatus() {
        return companyUserOpenAccountCompletedStatus == 1;
    }
}
