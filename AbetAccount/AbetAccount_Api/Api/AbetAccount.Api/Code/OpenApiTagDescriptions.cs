using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace AbetAccount.Api.Code
{
    public class OpenApiTagDescriptions : IDocumentFilter
    {

        static List<OpenApiTag> _OpenApiTagList = new List<OpenApiTag>();

        public static void InitOpenApiTagList(Type[] typeList)
        {
            foreach (var t in typeList)
            {
                var d = (DescriptionAttribute)t.GetCustomAttributes(typeof(DescriptionAttribute), true).FirstOrDefault();
                if (d != null) _OpenApiTagList.Add(new OpenApiTag() { Name = t.Name.Replace("Controller", string.Empty), Description = d.Description });
            }
        }

        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            swaggerDoc.Tags = _OpenApiTagList;
        }
    }
}
