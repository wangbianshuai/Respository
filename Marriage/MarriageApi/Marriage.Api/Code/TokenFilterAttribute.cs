using Marriage.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Marriage.Api.Code
{
    /// <summary>
    /// Token过滤
    /// </summary>
    public class TokenFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            bool blSucceed = true;
            try
            {
                string access_token = Code.Request.GetHeadersValue(context.HttpContext.Request, "access_token");
                string token = Code.Request.GetHeadersValue(context.HttpContext.Request, "token");

#if DEBUG
                if (token == "devtest")
                {
                    Guid userId = new Guid("C224C3A1-3A4A-477B-840A-2F4A2E86F550");
                    string sign = GetSign(context);
                    long time = Utility.Common.GetDateTotalMilliseconds(DateTime.Now);

                    token = Utility.UserToken.CreateToken(userId.ToString(), sign);
                    string appId = "devtest";
                    string md5 = Common.ComputeStringMd5(appId + time + token);
                    access_token = OpenDataAccessCore.Utility.Common.ToBase64String(appId + "@" + time + "@" + md5);
                }
#endif
                var tokenParameter = context.ActionDescriptor.EndpointMetadata.Where(w => w is SwaggerOpenApiTokenParameterAttribute).FirstOrDefault();
                if (tokenParameter != null)
                {
                    access_token = OpenDataAccessCore.Utility.Common.FromBase64String(access_token);

                    blSucceed = ParseAccessToken(context, access_token, token);
                    if (blSucceed) blSucceed = ParseToken(context, token);
                }
            }
            catch (Exception ex)
            {
                LoggerProxy.Exception("TokenFilterAttribute", "OnActionExecuting", ex);
                blSucceed = false;

                if (ex is TokenException) throw ex;
            }

            if (!blSucceed) throw new TokenException("解析token失败");

            base.OnActionExecuting(context);
        }

        string GetSign(ActionExecutingContext context)
        {
            string host = context.HttpContext.Request.Host.Host;
            string referer = Code.Request.GetHeadersValue(context.HttpContext.Request, "Referer");
            string userAgent = Code.Request.GetHeadersValue(context.HttpContext.Request, "User-Agent");
            string signKey = "QTQyQUMzMTEtMjhCRC00MTA4LTgwRkMtQ0Y3RkMxRkJENjE0";

#if DEBUG
#else
            if (!referer.ToLower().Contains(host.ToLower()))
            {
                throw new TokenException("解析Token失败");
            }
#endif
            return Common.ComputeStringMd5(userAgent + signKey);
        }

        bool ParseToken(ActionExecutingContext context, string token)
        {
            ControllerActionDescriptor controllerActionDescriptor = context.ActionDescriptor as ControllerActionDescriptor;

            Entity.Application.IRequest request = null;
            string requestKey = string.Empty;

            foreach (var item in context.ActionArguments)
            {
                var requestBase = item.Value as Entity.Application.IRequest;
                if (requestBase == null) continue;
                requestKey = item.Key;
                request = requestBase;
                break;
            }

            string sign = GetSign(context);

            string loginUserId = string.Empty;

            if ((controllerActionDescriptor.ControllerName == "MarriageUser" && controllerActionDescriptor.ActionName == "GetUserByOpenId")
                || (controllerActionDescriptor.ControllerName == "MarriageUser" && controllerActionDescriptor.ActionName == "Register")
                || (controllerActionDescriptor.ControllerName == "WxUser" && controllerActionDescriptor.ActionName == "GetWxUser"))
            {
                string loginmd5 = "d56b699830e77ba53855679cb1d252da";
                if (token.StartsWith(loginmd5))
                {
                    token = token.Replace(loginmd5, string.Empty);
                    loginUserId = OpenDataAccessCore.Utility.Common.FromBase64String(token);

                    if ((request != null && request.AppId != loginUserId)
                    || (request == null && context.ActionArguments["appId"].ToString() != loginUserId))
                    {
                        throw new TokenException("解析Token失败");
                    }
                    else loginUserId = string.Empty;
                }
                else loginUserId = UserToken.ParseToken(token, sign);
            }
            else loginUserId = UserToken.ParseToken(token, sign);



            if (request != null)
            {
                request.LoginUserId = loginUserId;

                context.ActionArguments[requestKey] = request;
            }
            else context.ActionArguments["loginUserId"] = loginUserId;

            context.RouteData.Values.Add("LoginUserId", loginUserId);
            context.RouteData.Values.Add("Sign", sign);

            return true;
        }

        bool ParseAccessToken(ActionExecutingContext context, string access_token, string token)
        {
            Entity.Application.IRequest request = null;
            string requestKey = string.Empty;

            foreach (var item in context.ActionArguments)
            {
                var requestBase = item.Value as Entity.Application.IRequest;
                if (requestBase == null) continue;
                requestKey = item.Key;
                request = requestBase;
                break;
            }

            string[] strs = access_token.Split('@');
            string appId = strs[0];
            string time = strs[1];
            string md5 = strs[2];

            string md52 = Common.ComputeStringMd5(appId + time + token);

            long time1 = long.Parse(time);
            long time2 = Utility.Common.GetDateTotalMilliseconds(DateTime.Now);

            long st = 10000;

            if (md5.ToLower().Equals(md52.ToLower()) && (time2 - st < time1 && time1 < time2 + st))
            {
                if (request != null)
                {
                    request.AppId = appId;
                    request.IpAddress = Code.Request.GetClientIp(context.HttpContext.Request);

                    context.ActionArguments[requestKey] = request;
                }
                else context.ActionArguments["appId"] = appId;
                return true;
            }
            return false;
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            string loginUserId = string.Empty;
            string sign = string.Empty;
            if (context.RouteData.Values.ContainsKey("LoginUserId")) loginUserId = (string)context.RouteData.Values["LoginUserId"];
            if (context.RouteData.Values.ContainsKey("Sign")) sign = (string)context.RouteData.Values["Sign"];

            var obj = context.Result as ObjectResult;
            if (obj != null)
            {
                var response = obj.Value as Entity.Application.IResponse;
                if (response != null)
                {
                    if (string.IsNullOrEmpty(response.Token))
                    {
                        if (!string.IsNullOrEmpty(loginUserId)) response.Token = UserToken.CreateToken(loginUserId, sign);
                    }
                    else if (response.Token == "null")
                    {
                        response.Ack.Code = -100;
                        response.Token = null;
                    }
                    else response.Token = UserToken.CreateToken(response.Token, sign);
                }
            }

            base.OnActionExecuted(context);
        }
    }
}
