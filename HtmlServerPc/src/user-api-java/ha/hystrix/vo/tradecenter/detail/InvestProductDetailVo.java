package com.xxd.ha.hystrix.vo.tradecenter.detail;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

/**
 * 产品的交易详情
 */
@Data
public class InvestProductDetailVo {

    private double apr;
    private double maxAmount;
    private String usable;
    private boolean meetTermOfPurchase;
    private double floatApr;
    private String description;
    private String period;
    private String periodUnit;
    private int remAccount;
    @JSONField(name = "isLogin")
    private boolean isLogin;
    private int mostTender;
    private String lowestTender;
    private long closeTime;
    private String name;
    private String step;
    private String id;
    @JSONField(name = "isBetweenPurchaseTime")
    private boolean isBetweenPurchaseTime;
    private long openTime;
    private String account;
    private String terms;
    private String useRedenvelope;
    private int status;
    private String collectedInterest;
    private String releasePeriodCount;
    @JSONField(name = "isPurchasedProduct")
    private boolean isPurchasedProduct;
    private float income100;
    private float income1000;
    private float income5000;
    private float income10000;
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
