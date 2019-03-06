package com.xxd.ha.hystrix.vo.usercenter;

import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

/**
 * 城市列表.
 * @author EvanChou
 * @date 2018-01-26 上午11:25
 */
@Data
public class CityListVo {

    private List<City> cityList = Lists.newArrayList();

    @Data
    public static class City {

        private String code;

        private String name;
    }

}
