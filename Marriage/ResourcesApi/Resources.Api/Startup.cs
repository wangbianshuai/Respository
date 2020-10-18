using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Policy;
using System.Threading.Tasks;
using Autofac;
using log4net;
using log4net.Config;
using log4net.Repository;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;

namespace Resources.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            InitLoggerRepository();
        }

        void InitLoggerRepository()
        {
            try
            {
                ILoggerRepository logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
                XmlConfigurator.Configure(logRepository, new System.IO.FileInfo("log4net.config"));
                Utility.LoggerProxy.InitLogger(logRepository);
            }
            catch (Exception ex)
            {
                Utility.LoggerProxy.Exception("Startup", "InitLoggerRepository", ex);
            }
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddControllersAsServices();

            services.AddMvc().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
            });

            services.AddSwaggerGen(options =>
            {
                options.DocumentFilter<Code.OpenApiTagDescriptions>();
                options.OperationFilter<Code.AddHeadersParameters>();
                options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo()
                {
                    Title = "Resources API接口文档",
                    Version = "v1",
                    Description = "RESTful API for Resources",
                    Contact = new Microsoft.OpenApi.Models.OpenApiContact() { Name = "wangbianzhai", Email = "277822695@qq.com" }
                });
                // 为 Swagger JSON and UI设置xml文档注释路径
                var basePath = Path.GetDirectoryName(typeof(Program).Assembly.Location);//获取应用程序所在目录
                var xmlPath = Path.Combine(basePath, "Resources.Api.xml");
                options.IncludeXmlComments(xmlPath);
                xmlPath = Path.Combine(basePath, "Resources.Entity.xml");
                options.IncludeXmlComments(xmlPath);
            });
        }

        public void ConfigureContainer(ContainerBuilder builder)
        {
            RegisterTypes("Resources.Application", builder);
            RegisterTypes("Resources.Data", builder);
            RegisterTypes("Resources.Domain", builder);

            var controllersTypesInAssembly = typeof(Startup).Assembly.GetExportedTypes()
                    .Where(type => typeof(ControllerBase).IsAssignableFrom(type)).ToArray();

            Code.OpenApiTagDescriptions.InitOpenApiTagList(controllersTypesInAssembly);
            builder.RegisterTypes(controllersTypesInAssembly).PropertiesAutowired();
        }

        void RegisterTypes(string assemblyString, ContainerBuilder builder)
        {
            Assembly assembly = Assembly.Load(assemblyString);

            List<Type> typeList = assembly.GetTypes().ToList();
            List<Type> interfaceList = typeList.Where(w => w.IsInterface).ToList();
            List<Type> classList = typeList.Where(w => !w.IsAbstract && w.IsClass).ToList();

            classList.ForEach(c =>
            {
                var list = (from a in c.GetInterfaces()
                            from b in interfaceList
                            where a.FullName == b.FullName
                            select a);
                foreach (var d in list)
                {
                    builder.RegisterType(c).As(d).AsImplementedInterfaces().PropertiesAutowired();
                }
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            // UseCors 需在UseRouting与UseEndpoints之间
            app.UseCors(builder =>
            {
                builder.AllowAnyHeader();
                builder.AllowAnyMethod();
                builder.AllowAnyOrigin();
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint(Configuration["virtualPath"] + "/swagger/v1/swagger.json", "Resources API V1");
            });

            app.UseStaticFiles();

            Code.AppSettings.SetAppSetting(Configuration.GetSection("AppSetting"));
        }
    }
}
