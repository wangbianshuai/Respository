package com.xxd.ha.hystrix.vo.bulletin;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class BulletinInvestmentRankVo implements Serializable {

    private static final long serialVersionUID = 142633204438362127L;

    private String currentMonth;

    private List<Item> items = new ArrayList<Item>();

    @Data
    public static class Item {

        private String nickName;

        private BigDecimal investmentAmount;

    }
}
