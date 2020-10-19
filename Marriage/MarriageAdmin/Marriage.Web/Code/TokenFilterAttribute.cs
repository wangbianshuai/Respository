using Marriage.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Marriage.Web.Code
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
                var tokenParameter = context.ActionDescriptor.EndpointMetadata.Where(w => w is ApiTokenParameterAttribute).FirstOrDefault();
                if (tokenParameter != null)
                {
                    string access_token = Code.Request.GetHeadersValue(context.HttpContext.Request, "access_token");
                    string token = Code.Request.GetHeadersValue(context.HttpContext.Request, "token");

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
            string signKey = "Qzk1NDJEMDEtQjYyNC00RTg3LUFCQ0YtQ0M0QjEzM0NCMkNE";

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
            string entityName = string.Empty;
            string methodName = string.Empty;

            foreach (var item in context.ActionArguments)
            {
                if (item.Key == "entityName") entityName = (string)item.Value;
                else if (item.Key == "methodName") methodName = (string)item.Value;
            }

            string sign = GetSign(context);

            string loginUserId = string.Empty;

            if (entityName == "AdminUser" && methodName == "Login")
            {
                string loginmd5 = "d56b699830e77ba53855679cb1d252da";
                if (token.StartsWith(loginmd5))
                {
                    token = token.Replace(loginmd5, string.Empty);
                    loginUserId = OpenDataAccessCore.Utility.Common.FromBase64String(token);
                }
                else loginUserId = UserToken.ParseToken(token, sign);
            }
            else loginUserId = UserToken.ParseToken(token, sign);

            context.ActionArguments["loginUserId"] = loginUserId;
            context.ActionArguments["sign"] = sign;

            return true;
        }

        bool ParseAccessToken(ActionExecutingContext context, string access_token, string token)
        {
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
                context.ActionArguments["appId"] = appId;
                return true;
            }
            return false;
        }
    }
}
