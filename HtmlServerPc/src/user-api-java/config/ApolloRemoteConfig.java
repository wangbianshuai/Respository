package com.xxd.config;

import com.alibaba.fastjson.JSONObject;
import com.ctrip.framework.apollo.Config;
import com.ctrip.framework.apollo.model.ConfigChangeEvent;
import com.ctrip.framework.apollo.spring.annotation.ApolloConfig;
import com.ctrip.framework.apollo.spring.annotation.ApolloConfigChangeListener;
import com.xxd.common.util.JsonUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ApolloRemoteConfig {

    private static final Logger logger = LoggerFactory.getLogger(ApolloRemoteConfig.class);


    /**
     * 枚举从远程配置中心拉取配置项.
     * staticHost -- 静态资源域名
     * xxdVersion -- 静态资源版本号
     * registerNumber -- 注册人数
     * managementText -- 借款人借款金额未超过20万的提示文案
     * projectRiskText -- 资金出借风险提示函文案
     * guaranteeText -- 还款保障措施文案
     */
    public enum PropertiesName {

        STATIC_HOST("staticHost"),

        XXD_VERSION("xxdVersion"),

        REGISTER_NUMBER("registerNumber"),

        MANAGEMENT_TEXT("managementText"),

        PROJECT_RISK_TEXT("projectRiskText"),

        GUARANTEE_TEXT("guaranteeText");

        private String name;

        public String getName() {
            return name;
        }

        PropertiesName(String name) {
            this.name = name;
        }
    }

    private static final ConcurrentHashMap properties = new ConcurrentHashMap();


    @ApolloConfig
    Config config;


    public static String getPropertyValue(String keyName) {
        Object object = properties.get(keyName);
        if (object != null) {
            return object.toString();
        }
        return StringUtils.EMPTY;
    }

    public static JSONObject getVersionProperties() {
        JSONObject jsonObject = new JSONObject();
        String host = getPropertyValue(PropertiesName.STATIC_HOST.name);
        jsonObject.put(PropertiesName.STATIC_HOST.name, host);
        String version = getPropertyValue(PropertiesName.XXD_VERSION.name);
        jsonObject.put(PropertiesName.XXD_VERSION.name, version);
        return jsonObject;
    }

    public static JSONObject getAllProperties() {
        return JsonUtil.toJSONObject(properties);
    }

    /**
     * 启动时从配置中心获取配置.
     */
    @PostConstruct
    private void init() {
        logger.info("=================== apollo init remote properties ===================");
        for (PropertiesName propertiesName : PropertiesName.values()) {
            String remoteValue = config.getProperty(propertiesName.getName(), "");
            properties.put(propertiesName.getName(), remoteValue);
            logger.info("get property {} value {} form apollo", propertiesName.getName(), remoteValue);
        }
        logger.info("================= apollo init remote properties end =================");

    }

    /**
     * 监听远程配置中心变化.
     * @param changeEvent
     */
    @ApolloConfigChangeListener
    private void onConfigChange(ConfigChangeEvent changeEvent) {
        logger.info("=================== apollo change remote properties ===================");
        for (PropertiesName propertiesName : PropertiesName.values()) {
            if (changeEvent.isChanged(propertiesName.getName())) {
                String remoteValue = config.getProperty(propertiesName.getName(), "");
                properties.put(propertiesName.getName(), remoteValue);
                logger.info("change property [{}] value [{}] form apollo", propertiesName.getName(), remoteValue);
            }
        }
        logger.info("================= apollo change remote properties end =================");
    }

}
