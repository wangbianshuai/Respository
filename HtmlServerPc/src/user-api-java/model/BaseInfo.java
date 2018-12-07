/**
 * Copyright (c) 2017, www.xinxindai.com All Rights Reserved.
 */
package com.xxd.model;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;


@Data
public class BaseInfo implements Serializable {

    private static final long serialVersionUID = 4746951106860135567L;
    // Fields
    private Long userId;
    private String idCardType;
    private String idCardNo;
    private String realName;
    private String gender;
    private String degree;
    private Date birthday;
    private String province;
    private String city;
    private String street;
    private String maritalStatus;
    private String nativePlace;
    private String ability;
    private String homeAddr;
    private String homeTel;
    private String companyAddr;
    private String companyTel;
    private String companyIndustry;
    private String position;
    private String income;
    private String socialinSurCode;
    private String interest;
    private String note;
    private Date createDate;
    private String createip;
    private Date modifyDate;
    private String occupation;
    private String userType;
}