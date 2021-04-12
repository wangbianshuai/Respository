using AbetAccount.Admin.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AbetAccount.Admin.Web.Code
{
    /// <summary>
    /// 异常
    /// </summary>
    public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            Code.Response response = new Code.Response();
            response.Ack.IsSuccess = false;
            response.Ack.Code = -1;
            response.Ack.Message = context.Exception.Message;

            if (context.Exception is TokenException) response.Ack.Code = -100;
            else LoggerProxy.Exception("ApiExceptionFilterAttribute", "OnException", context.Exception);

            context.HttpContext.Response.WriteAsync(Common.ToJson(response));

            context.ExceptionHandled = true;
        }
    }
}
