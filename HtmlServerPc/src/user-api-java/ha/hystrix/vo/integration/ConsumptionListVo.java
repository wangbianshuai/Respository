package com.xxd.ha.hystrix.vo.integration;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 消费贷标的列表model.
 */
@Data
public class ConsumptionListVo {

    private int pageSize;
    private int currentPage;
    private int totalCount;
    private List<ItemsBean> items;

    @Data
    public static class ItemsBean {

        private BigDecimal leastPeriodValue = new BigDecimal(0);
        private String productId;
        private BigDecimal plannedAnnualRate = new BigDecimal(0);
        private BigDecimal bidAmount = new BigDecimal(0);
        private String productCategory;
        private int ROW_ID;
        private BigDecimal leftTenderAmount = new BigDecimal(0);
        private String bidCode;
        private String id;
        private String leastPeriodType;
        private String bidName;
        private String productType;
        private StatusBean status;
        private String riskGrade;

        @Data
        public static class StatusBean {
            private String code;
            private String message;
        }
    }
}
