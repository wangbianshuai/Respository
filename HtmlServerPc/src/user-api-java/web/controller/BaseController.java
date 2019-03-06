package com.xxd.web.controller;

import com.xxd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @Description
 * Provide the basis for support, suggest all of the controllers
 * should be extends from this Controller.
 */
@Controller
public class BaseController {

	@Autowired
	public HttpServletRequest request;
	
	@Autowired
	public HttpServletResponse response;

	@Autowired
	public UserService userService;
}