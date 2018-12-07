package com.xxd.enums;

/**
 * 用户类型.
 *
 * @author EvanChou
 * @date 2018-01-26 上午10:32
 */
public enum UserTypeEnum {

    UNKNOWN("","未知"),

    INDIVIDUAL("1", "个人"),

    ENTERPRISE("2", "企业"),

    NEW_ENTERPRISE("3", "新企业");

    private String type;

    private String desc;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    UserTypeEnum(String type, String desc) {
        this.type = type;
        this.desc = desc;
    }

    UserTypeEnum() {
    }

}
