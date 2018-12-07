package com.xxd.ha.hystrix.vo.usercenter;

import com.google.common.collect.Maps;
import lombok.Data;

import java.util.Map;

/**
 * 用户固定资产，私营业主，财务状况，联系方式.
 *
 * @author EvanChou
 * @date 2018-01-26 下午5:26
 */
@Data
public class PersonalInfosVo {

    /**
     * 固定资产
     */
    Map<String, Item> infos = Maps.newHashMap();

    /**
     * 私营业主
     */
    Map<String, Item> pbinfos = Maps.newHashMap();

    /**
     * 财务状况
     */
    Map<String, Item> fninfos = Maps.newHashMap();

    /**
     * 联系方式
     */
    Map<String, Item> coninfos = Maps.newHashMap();

    @Data
    public static class Item {

        private long createDate;

        private String createIp;

        private int extDetailId;

        private int extKeyId;

        private String extValue;

        private String keyName;

        private long modifyDate;

        private int userId;
    }
}
