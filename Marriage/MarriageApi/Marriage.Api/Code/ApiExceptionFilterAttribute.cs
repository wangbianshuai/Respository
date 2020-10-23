using Marriage.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Marriage.Api.Code
{
    /// <summary>
    /// 异常
    /// </summary>
    public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
    {

        public override void OnException(ExceptionContext context)
        {
            Entity.Application.Response response = new Entity.Application.Response();
            response.Ack.IsSuccess = false;
            response.Ack.Code = -1;
            response.Ack.Message = context.Exception.Message;

            if (context.Exception is TokenException) response.Ack.Code = -100;
            else LoggerProxy.Exception("ApiExceptionFilterAttribute", "OnException", context.Exception);

            context.HttpContext.Response.WriteAsync(Common.ToJson(response));

            base.OnException(context);
        }
    }
}
