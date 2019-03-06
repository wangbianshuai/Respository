package com.xxd.ha.hystrix.vo.bulletin;


import lombok.Data;

import java.io.Serializable;

@Data
public class BulletinAchievementVo implements Serializable{


    private static final long serialVersionUID = -8387901800350397927L;

    private String totalRegister;
    private Object securityItem;
    private Object totalIncomeItem;
    private Object totalTradeItem;
}
