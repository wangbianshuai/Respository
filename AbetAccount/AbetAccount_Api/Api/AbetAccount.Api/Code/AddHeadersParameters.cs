using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AbetAccount.Api.Code
{
    public class AddHeadersParameters : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.Parameters == null) operation.Parameters = new List<OpenApiParameter>();

            var list = context.MethodInfo.GetCustomAttributes(typeof(SwaggerOpenApiParameterAttribute), false);
            foreach (var p in list)
            {
                var parameter = p as SwaggerOpenApiParameterAttribute;
                operation.Parameters.Add(new OpenApiParameter()
                {
                    Name = parameter.Name,
                    Description = parameter.Description,
                    Schema = new OpenApiSchema() { Type = parameter.Type },
                    In = parameter.In,
                    Required = parameter.Required,
                });
            }

            var list2 = context.MethodInfo.GetCustomAttributes(typeof(SwaggerOpenApiTokenParameterAttribute), false);
            foreach (var p in list2)
            {
                var parameter = p as SwaggerOpenApiTokenParameterAttribute;
                parameter.TokenList.ForEach(t =>
                {
                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = t.Name,
                        Description = t.Description,
                        Schema = new OpenApiSchema() { Type = t.Type },
                        In = t.In,
                        Required = t.Required,
                    });
                });
            }
        }
    }

    public class SwaggerOpenApiParameterAttribute : Attribute
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public ParameterLocation In { get; set; }
        public bool Required { get; set; }
    }

    public class SwaggerOpenApiTokenParameterAttribute : Attribute
    {
        public List<SwaggerOpenApiToken> TokenList { get; set; }

        public SwaggerOpenApiTokenParameterAttribute()
        {
            TokenList = new List<SwaggerOpenApiToken>()
            {
                new SwaggerOpenApiToken(){Description = "访问Token", In = ParameterLocation.Header, Name = "access_token", Required = true, Type = "string"},
                new SwaggerOpenApiToken(){Description = "请求Token", In = ParameterLocation.Header, Name = "token", Required = true, Type = "string"}
            };
        }
    }

    public class SwaggerOpenApiToken
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public ParameterLocation In { get; set; }
        public bool Required { get; set; }
    }
}
