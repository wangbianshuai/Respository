package com.xxd.web.controller.usercenter;

import com.xxd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author EvanChou
 * @create 2017-11-23 6:10 PM
 */
@Controller
@RequestMapping("/usercenter")
public class BundledController extends AbstractIsInvestController {

    @Autowired
    UserService userService;

    /**
     * 银行卡设置
     * @param model
     * @return
     */
    @RequestMapping(value = "/changeCard.html")
    public String changeCard(Model model) {

        return "usercenter/personalData/changeCard";
    }

    /**
     * 银行卡设置
     * @param model
     * @return
     */
    @RequestMapping(value = "/bundled.html")
    public String bundled(Model model) {

        return "usercenter/personalData/bundled";
    }

}
