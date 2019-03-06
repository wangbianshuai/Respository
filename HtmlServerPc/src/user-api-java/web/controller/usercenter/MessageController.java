package com.xxd.web.controller.usercenter;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author EvanChou
 * @date 2017-12-18 4:29 PM
 */
@Controller
@RequestMapping("/usercenter")
public class MessageController extends AbstractIsInvestController {

    @RequestMapping("message.html")
    public String index() {

        return "usercenter/message/message";
    }

}
