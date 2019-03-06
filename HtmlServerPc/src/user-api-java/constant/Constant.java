/**
 * Copyright (c) 2017, www.xinxindai.com All Rights Reserved. 
 *
 */
package com.xxd.constant;

/**
 * 描述
 *
 * @version $Id: Constant.java 2017/3/28 14:10 $
 * @since jdk1.6
 */
public class Constant {
    //返回结果：0成功，-1失败
    public static int RETURN_SUCC = 0;

    public static int RETURN_ERROR = -1;
    /**
     * 新新推广成功返回值
     */
    public static int XXTG_RESULT_SUCCESS = 1;
    /**
     * 新新推广失败返回值
     */
    public static int XXTG_RESULT_FAIL = -1;
    /**Token失效错误*/
    public static int TOKEN_INVALID_ERROR = 301;

	//短期理财产品类型 月进斗金
	public static final String MONTH_GOLD_PRODUCT_TYPE = "monthgold";

	//短期理财产品类型 七天大胜
	public static final String SEVEN_GOLD_PRODUCT_TYPE = "sevengold";

    //省市字典，顶级节点编码
    public static final String TOP_NODE_CODE_PRO_CITY_DIC = "000000";
    public static final Integer XINYEDAI_DIC_SPECIALAREA_CODE = 15;


    //'职业状态: 01工薪族 02个体商户 03私营业主 04在校学生 09其他（学生身份不能回逆）';
    public static String OCCUPATION_STATE_WAGE_EARNER = "01";
    public static String OCCUPATION_STATE_SELF_EMPLOYED = "02";
    public static String OCCUPATION_STATE_PRIVATE_BUSINESS = "03";
    public static String OCCUPATION_STATE_UNDERGRADUATE = "04";
    public static String OCCUPATION_STATE_OTHER = "09";

    public static final String USERTOKEN = "userToken";

    public static final String TOKEN = "Token";

    public static final String BIZAPI_SUCCESS_CODE = "200000";
}
