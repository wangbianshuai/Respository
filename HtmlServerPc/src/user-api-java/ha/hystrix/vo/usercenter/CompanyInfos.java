package com.xxd.ha.hystrix.vo.usercenter;

import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

/**
 * 企业信息.
 * @author EvanChou
 * @date 2018-02-02 下午4:19
 */
@Data
public class CompanyInfos {


    private List<CompanyInfoBean> companyInfo = Lists.newArrayList();

    @Data
    public static class CompanyInfoBean {
        private long actualPayment;
        private String addIp;
        private long addTime;
        private String busLicenseNo;
        private String busLicenseUrl;
        private String orgInstitutionUrl;
        private String taxRegistrationUrl;
        private int certificatesType;
        private String comReCardId;
        private String comRepMobileNo;
        private String comRepName;
        private String commonPerEmailNo;
        private String commonPerMobileNo;
        private String commonPerName;
        private String companyAddress;
        private String companyName;
        private String companySize;
        private long id;
        private String isSCC;
        private String managementArea;
        private String modifyIp;
        private long modifyTime;
        private String orgInstitutionNo;
        private String registeredAddress;
        private long registeredCapital;
        private long registrationTime;
        private String shareholderName;
        private int shareholderType;
        private String status;
        private String taxRegistrationNo;
        private int userId;
    }
}
