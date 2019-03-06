package com.xxd.ha.hystrix.vo.tradecenter.product;

import com.xxd.ha.hystrix.vo.tradecenter.StatusVo;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * 新元宝 模型
 */
@Data
public class XYBVo implements Serializable {

    private static final long serialVersionUID = 6151795535218218772L;

    private String name = "";

    private String isMemberDay = "";

    private String accumulatedInvestors = "";

    private List<Period> items = new ArrayList<Period>();

    @Data
    public static class Period {

        private String remark = "";

        private String id = "";

        private String periodName = "";

        private String plannedAnnualRateFrom = "";

        private String plannedAnnualRateTo = "";

        private float floatingRate;

        private int frozenPeriod;

        private String leastPeriod = "";

        private String leastPeriodUnit = "";

        private String leastTenderAmountLabel = "";

        private String mostTenderAmountLabel = "";

        private String leftAmount = "";

        private StatusVo status = new StatusVo();

    }
}
