/**
 * Copyright (c) 2017, www.xinxindai.com All Rights Reserved.
 */
package com.xxd.model;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class User implements Serializable {

    private static final long serialVersionUID = 873360115410343140L;

    private Long userId;
    private String userName;
    private String nickName;
    private String email;
    private String mobile;
    private String headImg;
    private String password;
    private String payPassword;
    private String regsource;
    private String region;
    private String referer;
    private Date expireDate;
    private String status;
    private Date addTime;
    private String addIp;
    private Date modifyDate;
    private String userNameMD5;
    private Integer securityQid;
    private String securityans;
    private String occupation;
}
