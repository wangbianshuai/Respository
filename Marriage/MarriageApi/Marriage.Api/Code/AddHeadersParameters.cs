using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Marriage.Api.Code
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
        }
    }

    public class SwaggerOpenApiParameterAttribute: Attribute
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public ParameterLocation In { get; set; }
        public bool Required { get; set; }
    }
}
