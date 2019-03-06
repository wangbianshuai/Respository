package com.xxd.ha.hystrix.vo.investment;

import lombok.Data;

/**
 * 用户风险测评结果.
 * @author EvanChou
 * @date 2018-01-22 下午6:06
 */
@Data
public class RiskExamResultVo {

    private Boolean status = false;

    private Results results = new Results();

    @Data
    public static class Results {

        private String notes;

        private Integer totalScore = 0;


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
         * 默认5次
         * 用户剩余评测次数
         */
        private int count = 5;
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
}
