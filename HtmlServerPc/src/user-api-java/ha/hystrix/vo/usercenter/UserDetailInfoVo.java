package com.xxd.ha.hystrix.vo.usercenter;

import lombok.Data;

/**
 * @author zhangshengwen
 * @date 2018/1/11
 */
@Data
public class UserDetailInfoVo {

    private BaseInfo baseInfo = new BaseInfo();

    private UserDetailInfo userDetailInfo = new UserDetailInfo();

    @Data
    public static class BaseInfo {

        private String ability;

        private String birthdayStr;

        private String city;

        private String companyaddr;

        private String companyindustry;

        private String companytel;

        private long createdate;

        private String createip;

        private String degree;

        private String gender;

        private String homeaddr;

        private String hometel;

        private String idcardno;

        private String idcardtype;

        private String income;

        private String interest;

        private String maritalstatus;

        private long modifydate;

        private String nativeplace;

        private String note;

        private String occupation;

        private String province;

        private String realname;

        private String socialinsurcode;

        private long userid;

        private String usertype;
    }

    @Data
    public static class UserDetailInfo {

        private String addip;

        private long addtime;

        private int coins;

        private int coupon;

        /**
         * 信用等级
         */
        private String creditLevel;

        private long expiredate;

        private int hasinitremind;

        private String headimg;

        private Integer infoPercent;

        private String isEmailAppro;

        private String isMobileAppro;

        private String isRealnameAppro;

        private String isVipAppro;

        private String isopenaccount;

        private String lastLoginTime;

        private long latestLoginTime;

        private String mobile;

        private String nickname;

        private String payPassword;

        private String referer;

        private String regsource;

        private String signed;

        private String status;

        private int userid;

        private String username;

        private String vipCode;

        private String email;

        /**
         * 用户类型"" -> 未设定 "1" -> 个人 "2" -> 企业
         */
        private String usertype;
    }
}
