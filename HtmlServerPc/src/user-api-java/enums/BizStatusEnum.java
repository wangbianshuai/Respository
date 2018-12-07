package com.xxd.enums;

/**
 * 定义业务状态.
 */
public enum  BizStatusEnum {

    BIZ_SUCCESS(200,"成功"),
    BIZ_ERROR(100,"失败");

    private int status;

    private String desc;

    public int getStatus() {
        return status;
    }

    public String getDesc() {
        return desc;
    }

    BizStatusEnum(int status, String desc) {
        this.status = status;
        this.desc = desc;
    }

}
