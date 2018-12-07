package com.xxd.ha.hystrix.vo.usercenter;

import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

/**
 * 省份.
 * @author EvanChou
 * @date 2018-01-26 上午11:16
 */
@Data
public class ProvinceListVo {

    private List<Province> provinceList = Lists.newArrayList();

    @Data
    public static class Province {

        private String code;

        private String name;
    }
}
