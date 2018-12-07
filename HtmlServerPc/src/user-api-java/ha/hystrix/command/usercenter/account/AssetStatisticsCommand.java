package com.xxd.ha.hystrix.command.usercenter.account;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Lists;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.xxd.common.bo.Message;
import com.xxd.common.enums.ApiEnum;
import com.xxd.common.util.JsonUtil;
import com.xxd.ha.hystrix.support.AbstractHystrixCommand;
import com.xxd.ha.hystrix.vo.usercenter.AccountInfoVo;

import java.util.List;

/**
 * 我的新新贷资产统计信息
 *
 * @author zhangshengwen
 * @date 2018/1/9
 */
public class AssetStatisticsCommand extends AbstractHystrixCommand<JSONObject> {

    private String token;

    private String ua;

    public AssetStatisticsCommand(String token, String ua) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("userCenter"))
                .andCommandKey(HystrixCommandKey.Factory.asKey(ApiEnum.API_TRADECENTER_ASSET_STATISTICS.getName())));
        this.token = token;
        this.ua = ua;
    }

    @Override
    protected JSONObject run() throws Exception {
        headers.addHeader("token", token)
                .addHeader("User-Agent", ua);
        return process(ApiEnum.API_TRADECENTER_ASSET_STATISTICS, headers, AccountInfoVo.class);
    }

    @Override
    protected void handlerMessage(Message message) {
        JSONObject data = JsonUtil.toJSONObject(message.getData());

        /**
         * 日日盈和步步高升累加统一展现为其他产品
         */
        AccountInfoVo.MapItem rry = JsonUtil.toObject(data.getJSONObject("rryMap"), AccountInfoVo.MapItem.class);
        AccountInfoVo.MapItem step = JsonUtil.toObject(data.getJSONObject("stepMap"), AccountInfoVo.MapItem.class);
        data.put("other", new AccountInfoVo.MapItem(
                rry.getCollectedInterest() + step.getCollectedInterest(),
                rry.getCollectInterest() + step.getCollectInterest(),
                rry.getEffectiveMoney() + step.getEffectiveMoney()));

        /**
         * 消费贷合并到散标里展现.
         */
        AccountInfoVo.MapItem sanbiao = JsonUtil.toObject(data.getJSONObject("sanbiaoMap"), AccountInfoVo.MapItem.class);
        AccountInfoVo.MapItem xfd = JsonUtil.toObject(data.getJSONObject("xfdMap"), AccountInfoVo.MapItem.class);
        sanbiao.setCollectedInterest(sanbiao.getCollectedInterest() + xfd.getCollectedInterest());
        sanbiao.setCollectInterest(sanbiao.getCollectInterest() + xfd.getCollectInterest());
        sanbiao.setEffectiveMoney(sanbiao.getEffectiveMoney() + xfd.getEffectiveMoney());

        /**
         * 组合数据,页面饼状图展现用。
         */
        AccountInfoVo.MapAccount mapAccount = JsonUtil.toObject(
                data.getJSONObject("mapAccount"), AccountInfoVo.MapAccount.class);
        List<AccountInfoVo.Percent> percents = Lists.newArrayList();

        // 可用余额
        percents.add(new AccountInfoVo.Percent("frozen", mapAccount.getFrozen()));
        // 冻结资金
        percents.add(new AccountInfoVo.Percent("usable", mapAccount.getUsable()));
        // 新手专享30天
        percents.add(new AccountInfoVo.Percent("xszx", mapAccount.getSumXSCP30T()));
        // 月进斗金
        percents.add(new AccountInfoVo.Percent("yjdj", mapAccount.getSumYueJinDouJin()));
        // 新元宝
        percents.add(new AccountInfoVo.Percent("xyb", mapAccount.getSumXinYuanBao()));
        // 月月派
        percents.add(new AccountInfoVo.Percent("yyp", mapAccount.getSumYyp()));
        // 新手标
        percents.add(new AccountInfoVo.Percent("xsb", mapAccount.getSumXinShouBiao()));
        // 散标
        percents.add(new AccountInfoVo.Percent("sb", mapAccount.getSumSanBiao() + mapAccount.getSumXFD()));
        // 其他
        percents.add(new AccountInfoVo.Percent("other", mapAccount.getSumRry() + mapAccount.getSumStep()));
        // 是否有投资
        boolean isInvest = false;
        for (AccountInfoVo.Percent percent : percents) {
            if (percent.getSum() > 0F) {
                isInvest = true;
            }
        }
        if (isInvest) {
            data.put("percents", JSON.parseArray(JSON.toJSONString(percents)));
        } else {
            percents.clear();
            percents.add(new AccountInfoVo.Percent("", 0D));
            data.put("percents", JSON.parseArray(JSON.toJSONString(percents)));
        }
    }

    @Override
    protected JSONObject getFallback() {
        return new JSONObject();
    }
}
