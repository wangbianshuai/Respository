using Autofac;
using log4net;
using log4net.Config;
using log4net.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Marriage.ComputeMarriageMakePair
{
    public class Startup
    {
        public Startup()
        {
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

        public IContainer ConfigureContainer()
        {
            ContainerBuilder builder = new ContainerBuilder();

            RegisterTypes("Marriage.Application", builder);
            RegisterTypes("Marriage.Data", builder);
            RegisterTypes("Marriage.Domain", builder);
            RegisterTypes("Marriage.Service", builder);

            return builder.Build();
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
    }
}
