/**
 * Copyright (c) 2017, www.xinxindai.com All Rights Reserved. 
 *
 */
package com.xxd.util;

import java.util.ResourceBundle;

/**
 * 描述
 *
 * @version $Id: Configuration.java 2017/3/28 15:07 $
 * @since jdk1.6
 */
public class Configuration {


	private static Object lock              = new Object();
	private static Configuration config     = null;
	private static ResourceBundle rb        = null;
	private static final String CONFIG_FILE = "validateConfig";

	private Configuration() {
		rb = ResourceBundle.getBundle(CONFIG_FILE);
	}

	public static Configuration getInstance() {
		synchronized(lock) {
			if(null == config) {
				config = new Configuration();
			}
		}
		return (config);
	}

	public String getValue(String key) {
		return (rb.getString(key));
	}
}