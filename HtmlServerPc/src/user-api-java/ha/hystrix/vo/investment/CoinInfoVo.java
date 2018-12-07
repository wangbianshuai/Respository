package com.xxd.ha.hystrix.vo.investment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用户新新币相关信息.
 * @author EvanChou
 * @date 2018-01-22 下午12:56
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoinInfoVo {

    /**
     * 新新币数量.
     */
    private Integer num = 0;

    /**
     * 可兑换金额.
     */
    private Double amount = 0D;

    /**
     * 兑换比率.
     */
    private Integer ratio = 50;
}
