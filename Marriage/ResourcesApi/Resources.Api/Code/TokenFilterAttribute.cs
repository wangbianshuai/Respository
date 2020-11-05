using Resources.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Resources.Api.Code
{
    /// <summary>
    /// Token过滤
    /// </summary>
    public class TokenFilterAttribute : ActionFilterAttribute
    {
        const string key = "784253FE-2E15-459F-93F3-26A23E9DE4B2";

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            bool blSucceed = true;
            try
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

                string token = Code.Request.GetHeadersValue(context.HttpContext.Request, "token");

                token = OpenDataAccessCore.Utility.Common.FromBase64String(token);

                string[] strs = token.Split('@');
                string appId = strs[0];
                string time = strs[1];
                string md5 = strs[2];

                string md52 = Common.ComputeStringMd5(appId + time + key);

                long time1 = long.Parse(time);
                long time2 = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds;

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
                }
                else blSucceed = false;
            }
            catch(Exception ex)
            {
                LoggerProxy.Exception("TokenFilterAttribute", "OnActionExecuting", ex);
                blSucceed = false;
            }
            if (!blSucceed) throw new TokenException("解析token失败");
         
            base.OnActionExecuting(context);
        }
    }

    public class TokenException : Exception
    {
        public TokenException(string message) : base(message)
        {

        }
    }
}
