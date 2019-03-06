package com.xxd.ha.hystrix.vo.tradecenter;

import lombok.Data;

import java.io.Serializable;

@Data
public class StatusVo implements Serializable{

	private static final long serialVersionUID = -9216989659135696176L;

	// 状态码
	private String code = "";

	// 消息
	private String message = "";

	
}
