package com.xxd.ha.hystrix.vo.tradecenter.product;

import com.xxd.ha.hystrix.vo.tradecenter.StatusVo;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 债券转让
 */
@Data
public class ZQZRVo implements Serializable {

    private static final long serialVersionUID = 4279393038216362650L;

    private String name;

    private List<Bid> items = new ArrayList<Bid>();

    @Data
    public static class Bid {

        private String label;

        private String name;

        private String id;

        private String plannedAnnualRate;

        private String leastPeriod;

        private String leastPeriodUnit;

        private String transferPrice;

        private String transferPriceFormat;

        private StatusVo status;

        private String riskGrade;

    }

}
