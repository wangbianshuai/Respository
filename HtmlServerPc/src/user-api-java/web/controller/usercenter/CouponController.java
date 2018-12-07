package com.xxd.web.controller.usercenter;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 礼券.
 * @author EvanChou
 * @date 2017-12-18 4:25 PM
 */
@Controller
@RequestMapping("/usercenter")
public class CouponController extends AbstractIsInvestController {


    @RequestMapping("coupon.html")
    public String index() {

        return "usercenter/activity/coupon";
    }

}
