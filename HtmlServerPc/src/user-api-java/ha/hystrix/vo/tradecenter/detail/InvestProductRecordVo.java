package com.xxd.ha.hystrix.vo.tradecenter.detail;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 产品交易记录
 */
@Data
public class InvestProductRecordVo {

    private int totalCount;
    private int pageSize;
    private int currentPage;
    private List<Period> items = new ArrayList<Period>();

    @Data
    public static class Period {
        private long addTime;
        private String userName;
        private int account;
    }
}


