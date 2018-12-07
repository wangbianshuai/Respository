package com.xxd.ha.hystrix.vo.usercenter;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;


@Data
public class UserVo implements Serializable {

    private static final long serialVersionUID = -6230957040092404824L;

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

}
