package com.xxd.ha.hystrix.vo.usercenter;

import lombok.Data;

import java.io.Serializable;

/**
 * @author zhangshengwen on 2018/3/20.
 */
@Data
public class QuestionUserInfoVo implements Serializable {

    /**
     "sumCount": 5,
     "testCount": 1,
     "quota": 300,
     "typeName": "平衡型",
     "count": 4,
     "nextTestTime": "2019-01-01"
     */

    /**
     * 总的测评次数
     */
    private String sumCount;

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
}
