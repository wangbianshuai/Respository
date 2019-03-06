package com.xxd.ha.hystrix.vo.tradecenter.product;

import com.xxd.ha.hystrix.vo.tradecenter.StatusVo;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * 散标直投 模型
 */
@Data
public class SBZTVo implements Serializable {

    private static final long serialVersionUID = 9049857711037597645L;

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

        private BigDecimal leftAmount = new BigDecimal(0.0);

        private String leftAmountFormat;

        private String percent;

        private BigDecimal bidAmount = new BigDecimal(0.0);

        private StatusVo status;

        private String riskGrade;

    }

}
