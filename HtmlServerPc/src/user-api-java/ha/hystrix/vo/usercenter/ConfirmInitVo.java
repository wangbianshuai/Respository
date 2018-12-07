package com.xxd.ha.hystrix.vo.usercenter;

import lombok.Data;

/**
 * 系统自动开户的提示窗口只会提示一次，一旦用户确认，不再提醒。
 */
@Data
public class ConfirmInitVo {
    private int code;
    private String message;

}
