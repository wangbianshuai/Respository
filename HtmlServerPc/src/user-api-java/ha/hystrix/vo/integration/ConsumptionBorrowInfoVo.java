package com.xxd.ha.hystrix.vo.integration;

import lombok.Data;

/**
 * 消费贷借款人信息.
 */
@Data
public class ConsumptionBorrowInfoVo {

    private IsSecurityBean isSecurity;
    private int successLoanNum;
    private String education;
    private String gender;
    private String idCardNo;
    private String birth;
    private String userid;
    private IsHaveCarBean isHaveCar;
    private String realname;
    private IsOverdueBean isOverdue;
    private String marriage;
    private String monthIncome;
    private String bidInfo;
    private String housingCondition;
    private String location;
    private double overdueSumAmount;
    private String creditRating;
    private int overdueCount;
    private String username;
    private String age;

    public static class IsSecurityBean {
        /**
         * code : BIDDING
         * message : 投标中
         */

        private String code;
        private String message;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class IsHaveCarBean {
        /**
         * code : BIDDING
         * message : 投标中
         */

        private String code;
        private String message;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class IsOverdueBean {
        /**
         * code : Y
         * message : 是
         */

        private String code;
        private String message;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
