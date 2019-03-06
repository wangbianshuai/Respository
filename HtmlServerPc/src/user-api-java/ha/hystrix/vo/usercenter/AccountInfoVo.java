package com.xxd.ha.hystrix.vo.usercenter;

import com.alibaba.fastjson.annotation.JSONField;
import com.google.common.collect.Lists;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * http://dev.xxd.com/tradeCenter/swagger-ui.html#!/AssetStatistics/getAssetStatisticsByTokenUsingGET
 * @author zhangshengwen
 * @date 2018/1/9
 */
@Data
public class AccountInfoVo {

    private MapAccount mapAccount = new MapAccount();

    private MapItem qitiandashengMap = new MapItem();

    private MapItem sanbiaoMap = new MapItem();

    private MapItem stepMap = new MapItem();

    private MapItem xfdMap = new MapItem();

    private MapItem xscp30tMap = new MapItem();

    private MapItem xinshoubiaoMap = new MapItem();

    private MapItem xinyuanbaoMap = new MapItem();

    private MapItem yuejindoujinMap = new MapItem();

    private MapItem yypMap = new MapItem();

    private MapItem rryMap = new MapItem();

    private MapItem other = new MapItem();

    /**
     * 各个产品投资占比金额.
     */
    private List<Percent> percents = Lists.newArrayList();

    @Data
    public static class MapAccount {
        /**
         * 累计活动奖励
         */
        private Double activityRecharge = 0D;
        /**
         * 累计推广奖励充值
         */
        private Double awardRecharge = 0D;
        /**
         * 累计现金充值
         */
        private Double cashRecharge = 0D;
        /**
         * 累计新新币兑换
         */
        private Double cashingRecharge = 0D;
        /**
         * 累计提现
         */
        private Double drawTotal = 0D;
        /**
         * 累计待收收益
         */
        private Double dueInInterestSumTotal = 0D;
        /**
         * 冻结金额
         */
        private Double frozen = 0D;
        /**
         * 借款账户_累计借款
         */
        private Double loanSum = 0D;
        /**
         * 借款账户_待还总额
         */
        private Double repaymentSum = 0D;
        /**
         * 本月待收收益
         */
        private Double sumCollectionThisMonth = 0D;
        /**
         * 本月累计赚取
         */
        private Double sumEarnedThisMonth = 0D;
        /**
         * 今年累计赚取
         */
        private Double sumEarnedThisYear = 0D;
        /**
         * 七天大胜
         */
        private Double sumQiTianDaSheng = 0D;
        /**
         * 散标
         */
        private Double sumSanBiao = 0D;
        /**
         * 步步高升
         */
        private Double sumStep = 0D;

        /**
         * 日日盈
         */
        private Double sumRry = 0D;

        /**
         * 消费贷
         */
        private Double sumXFD = 0D;
        /**
         * 新手标
         */
        private Double sumXinShouBiao = 0D;
        /**
         * 新元宝
         */
        private Double sumXinYuanBao = 0D;

        private Double sumYueJinDouJin = 0D;

        private Double sumYyp = 0D;

        /**
         * 新手专享.
         */
        private Double sumXSCP30T = 0D;

        /**
         * 资产总额
         */
        private Double sumTotal = 0D;

        /**
         * 可用余额
         */
        private Double usable = 0D;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MapItem {

        /**
         * 累计收益.
         */
        @JSONField(name = "COLLECTEDINTEREST")
        private Float collectedInterest = 0F;

        /**
         * 待收收益.
         */
        @JSONField(name = "COLLECTINTEREST")
        private Float collectInterest  = 0F;

        /**
         * 累计投资.
         */
        @JSONField(name = "EFFECTIVEMONEY")
        private Float effectiveMoney = 0F;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Percent {

        private String name;

        private Double sum = 0D;
    }
}
